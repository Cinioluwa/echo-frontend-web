import api from "../axios.config";

export interface AcademicDepartment {
  id: number;
  name: string;
  code: string;
  isActive?: boolean;
  collegeId?: number | null;
  college?: Pick<College, "id" | "name" | "code"> | null;
  _count?: { pings?: number; bodies?: number };
}

export interface College {
  id: number;
  name: string;
  code: string;
  isActive?: boolean;
  _count?: { departments?: number };
}

export interface RepresentativeBody {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  departmentId?: number | null;
  department?: Pick<AcademicDepartment, "id" | "name" | "code"> | null;
  _count?: { representatives?: number; assignedPings?: number };
}

export interface RepresentativePermissions {
  canRespond: boolean;
  canAcknowledge: boolean;
  canModerateWaves: boolean;
  canUpdateWaveProgress: boolean;
  canAssign: boolean;
  canResolve: boolean;
  canExport: boolean;
  canManageReps: boolean;
}

export interface RepresentativeProfile extends RepresentativePermissions {
  id: number;
  userId: number;
  title?: string | null;
  user: {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
  body?: RepresentativeBody | null;
  department?: AcademicDepartment | null;
  scopeLevel?: number | null;
  scopeHall?: string | null;
  responsibilities: string;
}

export interface InstitutionContextOptions {
  departments: Array<Pick<AcademicDepartment, "id" | "name" | "code">>;
  bodies: Array<Pick<RepresentativeBody, "id" | "name" | "slug" | "department">>;
  halls: string[];
  levels: number[];
}

/**
 * Coerces an unknown value into a real array.
 *
 * The web client and the API are deployed independently, so an older backend
 * can legitimately return a payload that omits fields the current client
 * expects (for example `halls`). Callers map over these lists during render,
 * so a missing field must never become `undefined`.
 */
function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

const normalizeContextOptions = (
  data: Partial<InstitutionContextOptions> | null | undefined,
): InstitutionContextOptions => ({
  departments: toArray(data?.departments),
  bodies: toArray(data?.bodies),
  halls: toArray<string>(data?.halls),
  levels: toArray<number>(data?.levels),
});

const institutionAdminService = {
  getContextOptions: async (organizationId: number): Promise<InstitutionContextOptions> => {
    const response = await api.get<InstitutionContextOptions>(
      `/public/organizations/${organizationId}/context-options`,
    );
    return normalizeContextOptions(response.data);
  },

  updateContextOptions: async (data: {
    halls: string[];
    levels: number[];
  }): Promise<Pick<InstitutionContextOptions, "halls" | "levels">> => {
    // Both fields must always be present — the API validates them as required
    // arrays, and sending undefined produces a 400 that reads as "cannot save".
    const halls = toArray<string>(data?.halls).map((hall) => String(hall).trim()).filter(Boolean);
    const levels = toArray<number>(data?.levels)
      .map((level) => Number(level))
      .filter((level) => Number.isInteger(level) && level > 0);

    const response = await api.patch<Pick<InstitutionContextOptions, "halls" | "levels">>(
      "/admin/context-options",
      { halls, levels },
    );
    return response.data;
  },

  getDepartments: async (): Promise<AcademicDepartment[]> => {
    const response = await api.get<{ departments: AcademicDepartment[] }>("/admin/departments");
    return toArray<AcademicDepartment>(response.data?.departments);
  },

  createDepartment: async (data: {
    name: string;
    code: string;
    collegeId?: number;
  }): Promise<AcademicDepartment> => {
    const response = await api.post<{ department: AcademicDepartment }>(
      "/admin/departments",
      data,
    );
    return response.data.department;
  },

  removeDepartment: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/admin/departments/${id}`,
    );
    return response.data;
  },

  getColleges: async (): Promise<College[]> => {
    const response = await api.get<{ colleges: College[] }>("/admin/colleges");
    return toArray<College>(response.data?.colleges);
  },

  createCollege: async (data: {
    name: string;
    code: string;
    departmentIds?: number[];
  }): Promise<College> => {
    const response = await api.post<{ college: College }>(
      "/admin/colleges",
      data,
    );
    return response.data.college;
  },

  updateCollege: async (
    id: number,
    data: { name: string; code: string; departmentIds: number[] },
  ): Promise<College> => {
    const response = await api.patch<{ college: College }>(
      `/admin/colleges/${id}`,
      data,
    );
    return response.data.college;
  },

  removeCollege: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/admin/colleges/${id}`,
    );
    return response.data;
  },

  getBodies: async (): Promise<RepresentativeBody[]> => {
    const response = await api.get<{ bodies: RepresentativeBody[] }>("/admin/bodies");
    return toArray<RepresentativeBody>(response.data?.bodies);
  },

  createBody: async (data: {
    name: string;
    departmentId?: number;
    description?: string;
  }): Promise<RepresentativeBody> => {
    const response = await api.post<{ body: RepresentativeBody }>("/admin/bodies", data);
    return response.data.body;
  },

  removeBody: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/admin/bodies/${id}`);
    return response.data;
  },

  getRepresentatives: async (): Promise<RepresentativeProfile[]> => {
    const response = await api.get<{ representatives: RepresentativeProfile[] }>("/admin/representatives");
    return response.data.representatives;
  },

  createRepresentative: async (data: {
    email: string;
    bodyId: number;
    departmentId?: number;
    title?: string;
    scopeLevel?: number;
    scopeHall?: string;
    responsibilities: string;
  } & RepresentativePermissions): Promise<RepresentativeProfile> => {
    const response = await api.post<{ profile: RepresentativeProfile }>("/admin/representatives", data);
    return response.data.profile;
  },

  removeRepresentative: async (profileId: number): Promise<void> => {
    await api.delete(`/admin/representatives/${profileId}`);
  },
};

export default institutionAdminService;
