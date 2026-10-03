import api from "../axios.config";

export interface AcademicDepartment {
  id: number;
  name: string;
  code: string;
  isActive?: boolean;
  _count?: { pings?: number; bodies?: number };
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

const institutionAdminService = {
  getContextOptions: async (organizationId: number): Promise<InstitutionContextOptions> => {
    const response = await api.get<InstitutionContextOptions>(
      `/public/organizations/${organizationId}/context-options`,
    );
    return response.data;
  },

  updateContextOptions: async (data: {
    halls: string[];
    levels: number[];
  }): Promise<Pick<InstitutionContextOptions, "halls" | "levels">> => {
    const response = await api.patch<Pick<InstitutionContextOptions, "halls" | "levels">>(
      "/admin/context-options",
      data,
    );
    return response.data;
  },

  getDepartments: async (): Promise<AcademicDepartment[]> => {
    const response = await api.get<{ departments: AcademicDepartment[] }>("/admin/departments");
    return response.data.departments;
  },

  createDepartment: async (data: { name: string; code: string }): Promise<AcademicDepartment> => {
    const response = await api.post<{ department: AcademicDepartment }>("/admin/departments", data);
    return response.data.department;
  },

  getBodies: async (): Promise<RepresentativeBody[]> => {
    const response = await api.get<{ bodies: RepresentativeBody[] }>("/admin/bodies");
    return response.data.bodies;
  },

  createBody: async (data: {
    name: string;
    departmentId?: number;
    description?: string;
  }): Promise<RepresentativeBody> => {
    const response = await api.post<{ body: RepresentativeBody }>("/admin/bodies", data);
    return response.data.body;
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
