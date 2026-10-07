import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronRight,
  Plus,
  Settings,
  Sliders,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAuthStore, useCategoriesStore, useUIStore } from "../../stores";
import { categoryService } from "../../api/services";
import type { CategoryData } from "../../api/types";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { categoryImages } from "../../components/CategoryImages";
import GeneralSettings from "../../components/admin/AdminSettings/GeneralSettings";
import MemberManagement from "../../components/admin/AdminSettings/MemberManagement";
import RulesSettings from "../../components/admin/AdminSettings/RulesSettings";
import { AdminPageProvider } from "../../contexts/AdminPageContext";
import institutionAdminService, {
  type AcademicDepartment,
  type College,
  type RepresentativeBody,
  type RepresentativePermissions,
  type RepresentativeProfile,
} from "../../api/services/institutionAdmin.service";

type WorkspaceTab =
  | "departments"
  | "bodies"
  | "representatives"
  | "organization"
  | "members"
  | "rules";

type PendingDelete =
  | { kind: "category"; id: number }
  | { kind: "college"; id: number }
  | { kind: "department"; id: number }
  | { kind: "body"; id: number };

type DepartmentDraft = { name: string; code: string; collegeId: string };
type CollegeDraft = { name: string; code: string };

const createDepartmentDraft = (): DepartmentDraft => ({ name: "", code: "", collegeId: "" });
const createCollegeDraft = (): CollegeDraft => ({ name: "", code: "" });

const initialPermissions: RepresentativePermissions = {
  canRespond: false,
  canAcknowledge: false,
  canModerateWaves: false,
  canUpdateWaveProgress: false,
  canAssign: false,
  canResolve: false,
  canExport: false,
  canManageReps: false,
};

const InstitutionWorkspace = () => {
  const user = useAuthStore((state) => state.user);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const organizationId = useAuthStore((state) => state.user?.organizationId);
  const isRepresentativeManager =
    user?.role === "REPRESENTATIVE" &&
    user.representativeProfile?.isActive === true &&
    user.representativeProfile.canManageReps === true;
  const canManageOrganizationSettings =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const [activeTab, setActiveTab] = useState<WorkspaceTab>(
    isRepresentativeManager ? "representatives" : "departments",
  );
  const [departments, setDepartments] = useState<AcademicDepartment[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [bodies, setBodies] = useState<RepresentativeBody[]>([]);
  const [representatives, setRepresentatives] = useState<RepresentativeProfile[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Body drilldown detail state
  const [selectedBody, setSelectedBody] = useState<RepresentativeBody | null>(null);

  // Modal open states
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [isAddingCollege, setIsAddingCollege] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingHalls, setIsAddingHalls] = useState(false);
  const [isAddingLevels, setIsAddingLevels] = useState(false);
  const [isAddingBody, setIsAddingBody] = useState(false);
  const [isAssigningRep, setIsAssigningRep] = useState(false);

  // Form states
  const [departmentDrafts, setDepartmentDrafts] = useState<DepartmentDraft[]>([
    createDepartmentDraft(),
  ]);
  const [collegeDrafts, setCollegeDrafts] = useState<CollegeDraft[]>([createCollegeDraft()]);
  const [bodyName, setBodyName] = useState("");
  const [bodyDepartmentId, setBodyDepartmentId] = useState("");
  const [bodyDescription, setBodyDescription] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [repTitle, setRepTitle] = useState("");
  const [repBodyId, setRepBodyId] = useState("");
  const [repDepartmentId, setRepDepartmentId] = useState("");
  const [repScopeLevel, setRepScopeLevel] = useState("");
  const [repScopeHall, setRepScopeHall] = useState("");
  const [allCategories, setAllCategories] = useState(true);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [permissions, setPermissions] = useState(initialPermissions);

  const [categoryDrafts, setCategoryDrafts] = useState<string[]>([""]);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const [hallOptions, setHallOptions] = useState<string[]>([]);
  const [levelOptions, setLevelOptions] = useState<number[]>([]);
  const [hallDrafts, setHallDrafts] = useState<string[]>([""]);
  const [levelDrafts, setLevelDrafts] = useState<string[]>([""]);

  const refresh = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (!organizationId) {
        throw new Error("Your institution context is unavailable.");
      }
      const [departmentList, collegeList, bodyList, representativeList, categoryList, contextOptions] =
        await Promise.all([
          institutionAdminService.getDepartments(),
          institutionAdminService.getColleges(),
          institutionAdminService.getBodies(),
          institutionAdminService.getRepresentatives(),
          categoryService.getAll(),
          institutionAdminService.getContextOptions(organizationId),
        ]);
      setDepartments(departmentList);
      setColleges(collegeList);
      setBodies(bodyList);
      setRepresentatives(representativeList);
      setCategories(categoryList);
      setHallOptions(contextOptions.halls);
      setLevelOptions(contextOptions.levels);

      // Refresh selected body if currently open
      if (selectedBody) {
        const updated = bodyList.find((b) => b.id === selectedBody.id);
        if (updated) setSelectedBody(updated);
      }
      return true;
    } catch (loadError) {
      console.error("Failed to load institution management data:", loadError);
      const responseData = (
        loadError as { response?: { data?: { error?: string; message?: string } } }
      )?.response?.data;
      setError(
        responseData?.error ||
          responseData?.message ||
          "We couldn't load institution management. Please refresh and try again.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [organizationId, selectedBody]);

  useEffect(() => {
    void refresh();
  }, []);

  const updateNotice = (message: string) => {
    setError(null);
    setNotice(message);
  };

  const runSave = async (action: () => Promise<unknown>, message: string): Promise<boolean> => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await action();
      const refreshed = await refresh();
      if (refreshed) {
        updateNotice(message);
      } else {
        setNotice(
          `${message} The list could not be refreshed; use Refresh to check the latest values.`,
        );
      }
      return true;
    } catch (saveError) {
      console.error("Institution management update failed:", saveError);
      const responseData = (
        saveError as { response?: { data?: { error?: string; message?: string } } }
      )?.response?.data;
      setError(
        responseData?.error ||
          responseData?.message ||
          "We couldn't save this change. Please check the details and try again.",
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const runBatchSave = async <T,>(
    actions: Array<() => Promise<T>>,
    applyCreated: (created: T[]) => void,
    itemName: string,
    pluralItemName: string,
  ): Promise<number> => {
    setSaving(true);
    setError(null);
    setNotice(null);
    const created: T[] = [];
    let failure: unknown;
    try {
      for (const action of actions) {
        try {
          created.push(await action());
        } catch (saveError) {
          failure = saveError;
          break;
        }
      }

      if (created.length) applyCreated(created);
      if (created.length === actions.length) {
        updateNotice(
          `${created.length} ${created.length === 1 ? itemName : pluralItemName} added successfully.`,
        );
      } else {
        const responseData = (
          failure as { response?: { data?: { error?: string; message?: string } } }
        )?.response?.data;
        const reason =
          responseData?.error ||
          responseData?.message ||
          (failure instanceof Error ? failure.message : "Please check the values and try again.");
        setError(
          created.length
            ? `Added ${created.length} of ${actions.length} ${pluralItemName}. ${reason}`
            : reason,
        );
      }
      return created.length;
    } finally {
      setSaving(false);
    }
  };

  const saveCategoryChange = async (
    action: () => Promise<CategoryData>,
    applyChange: (category: CategoryData) => void,
    message: string,
  ): Promise<boolean> => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const category = await action();
      applyChange(category);
      useCategoriesStore.getState().upsertCategory({
        id: category.id,
        label: category.name,
        labelIcon: categoryImages[category.name] || categoryImages.General,
      });
      useCategoriesStore.getState().invalidateCache();
      updateNotice(message);
      return true;
    } catch (saveError) {
      console.error("Category management update failed:", saveError);
      const responseData = (
        saveError as { response?: { data?: { error?: string; message?: string } } }
      )?.response?.data;
      setError(
        responseData?.error ||
          responseData?.message ||
          "We couldn't save this category change. Please check the details and try again.",
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const item = pendingDelete;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      if (item.kind === "category") {
        await categoryService.remove(item.id);
        setCategories((current) => current.filter((category) => category.id !== item.id));
        useCategoriesStore.getState().removeCategory(item.id);
        useCategoriesStore.getState().invalidateCache();
        updateNotice("Category deleted successfully.");
      } else if (item.kind === "college") {
        await institutionAdminService.removeCollege(item.id);
        setColleges((current) => current.filter((college) => college.id !== item.id));
        setDepartments((current) =>
          current.map((department) =>
            department.collegeId === item.id
              ? { ...department, collegeId: null, college: null }
              : department,
          ),
        );
        updateNotice("College deleted successfully. Its departments are now ungrouped.");
      } else if (item.kind === "department") {
        await institutionAdminService.removeDepartment(item.id);
        setDepartments((current) => current.filter((department) => department.id !== item.id));
        updateNotice("Department deleted successfully.");
      } else {
        await institutionAdminService.removeBody(item.id);
        setBodies((current) => current.filter((body) => body.id !== item.id));
        if (selectedBody?.id === item.id) setSelectedBody(null);
        setRepresentatives((current) =>
          current.filter((representative) => representative.body?.id !== item.id),
        );
        updateNotice("Representative body deleted successfully.");
      }
      setPendingDelete(null);
    } catch (deleteError) {
      console.error("Institution management delete failed:", deleteError);
      const responseData = (
        deleteError as { response?: { data?: { error?: string; message?: string } } }
      )?.response?.data;
      setError(
        responseData?.error ||
          responseData?.message ||
          "We couldn't delete this item. Please try again.",
      );
      setPendingDelete(null);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateDepartment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const drafts = departmentDrafts.map((draft) => ({
      ...draft,
      name: draft.name.trim(),
      code: draft.code.trim(),
    }));
    if (drafts.some((draft) => !draft.name || !draft.code)) {
      setError("Enter a name and short code for each department.");
      return;
    }
    const departmentCodes = drafts.map((draft) => draft.code.toUpperCase());
    if (
      new Set(departmentCodes).size !== departmentCodes.length ||
      departmentCodes.some((code) => departments.some((department) => department.code.toUpperCase() === code))
    ) {
      setError("Department short codes must be unique.");
      return;
    }
    void runBatchSave(
      drafts.map(
        (draft) => () =>
          institutionAdminService.createDepartment({
            name: draft.name,
            code: draft.code,
            ...(draft.collegeId ? { collegeId: Number(draft.collegeId) } : {}),
          }),
      ),
      (created) => setDepartments((current) => [...current, ...created]),
      "department",
      "departments",
    ).then((createdCount) => {
      setDepartmentDrafts(
        createdCount < drafts.length ? drafts.slice(createdCount) : [createDepartmentDraft()],
      );
      setIsAddingDepartment(false);
    });
  };

  const handleCreateCollege = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const drafts = collegeDrafts.map((draft) => ({
      name: draft.name.trim(),
      code: draft.code.trim(),
    }));
    if (drafts.some((draft) => !draft.name || !draft.code)) {
      setError("Enter a name and short code for each college.");
      return;
    }
    const collegeCodes = drafts.map((draft) => draft.code.toUpperCase());
    const collegeNames = drafts.map((draft) => draft.name.toLowerCase());
    if (
      new Set(collegeCodes).size !== collegeCodes.length ||
      collegeCodes.some((code) => colleges.some((college) => college.code.toUpperCase() === code)) ||
      new Set(collegeNames).size !== collegeNames.length ||
      collegeNames.some((name) => colleges.some((college) => college.name.toLowerCase() === name))
    ) {
      setError("College names and short codes must be unique.");
      return;
    }
    void runBatchSave(
      drafts.map((draft) => () => institutionAdminService.createCollege(draft)),
      (created) => setColleges((current) => [...current, ...created]),
      "college",
      "colleges",
    ).then((createdCount) => {
      setCollegeDrafts(
        createdCount < drafts.length ? drafts.slice(createdCount) : [createCollegeDraft()],
      );
      setIsAddingCollege(false);
    });
  };

  const handleCreateBody = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSave(
      () =>
        institutionAdminService.createBody({
          name: bodyName.trim(),
          ...(bodyDepartmentId ? { departmentId: Number(bodyDepartmentId) } : {}),
          ...(bodyDescription.trim() ? { description: bodyDescription.trim() } : {}),
        }),
      "Representative body created successfully.",
    ).then((saved) => {
      if (!saved) return;
      setBodyName("");
      setBodyDepartmentId("");
      setBodyDescription("");
      setIsAddingBody(false);
    });
  };

  const handleCreateCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const drafts = categoryDrafts.map((name) => name.trim());
    if (drafts.some((name) => !name)) {
      setError("Enter a name for each category.");
      return;
    }
    const categoryNames = drafts.map((name) => name.toLowerCase());
    if (
      new Set(categoryNames).size !== categoryNames.length ||
      categoryNames.some((name) => categories.some((category) => category.name.toLowerCase() === name))
    ) {
      setError("Category names must be unique.");
      return;
    }
    void runBatchSave(
      drafts.map((name) => () => categoryService.create(name)),
      (created) => {
        setCategories((current) => [...current, ...created]);
        const store = useCategoriesStore.getState();
        created.forEach((category) =>
          store.upsertCategory({
            id: category.id,
            label: category.name,
            labelIcon: categoryImages[category.name] || categoryImages.General,
          }),
        );
        store.invalidateCache();
      },
      "category",
      "categories",
    ).then((createdCount) => {
      setCategoryDrafts(createdCount < drafts.length ? drafts.slice(createdCount) : [""]);
      setIsAddingCategory(false);
    });
  };

  const handleRenameCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingCategoryId === null || !editingCategoryName.trim()) return;
    void saveCategoryChange(
      () => categoryService.updateName(editingCategoryId, editingCategoryName.trim()),
      (updated) =>
        setCategories((current) =>
          current.map((category) =>
            category.id === updated.id ? { ...category, ...updated } : category,
          ),
        ),
      "Category renamed successfully.",
    ).then((saved) => {
      if (saved) {
        setEditingCategoryId(null);
        setEditingCategoryName("");
      }
    });
  };

  const handleSaveContextOptions = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSave(
      () =>
        institutionAdminService.updateContextOptions({
          halls: hallOptions,
          levels: levelOptions,
        }),
      "Ping context choices saved successfully.",
    );
  };

  const handleCreateHalls = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const drafts = hallDrafts.map((hall) => hall.trim());
    if (drafts.some((hall) => !hall)) {
      setError("Enter a name for each hall.");
      return;
    }
    if (new Set(drafts.map((hall) => hall.toLowerCase())).size !== drafts.length) {
      setError("Each hall name must be unique.");
      return;
    }
    if (
      drafts.some((draft) =>
        hallOptions.some((hall) => hall.toLowerCase() === draft.toLowerCase()),
      )
    ) {
      setError("One or more hall names are already configured.");
      return;
    }
    const nextHalls = [...hallOptions, ...drafts];
    void runSave(
      () =>
        institutionAdminService.updateContextOptions({
          halls: nextHalls,
          levels: levelOptions,
        }),
      "Hall options added successfully.",
    ).then((saved) => {
      if (!saved) return;
      setHallOptions(nextHalls);
      setHallDrafts([""]);
      setIsAddingHalls(false);
    });
  };

  const handleCreateLevels = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const drafts = levelDrafts.map(Number);
    if (drafts.some((level) => !Number.isInteger(level) || level < 1)) {
      setError("Enter a valid positive number for each academic level.");
      return;
    }
    if (new Set(drafts).size !== drafts.length || drafts.some((level) => levelOptions.includes(level))) {
      setError("Each academic level must be unique.");
      return;
    }
    const nextLevels = [...levelOptions, ...drafts].sort((a, b) => a - b);
    void runSave(
      () =>
        institutionAdminService.updateContextOptions({
          halls: hallOptions,
          levels: nextLevels,
        }),
      "Academic levels added successfully.",
    ).then((saved) => {
      if (!saved) return;
      setLevelOptions(nextLevels);
      setLevelDrafts([""]);
      setIsAddingLevels(false);
    });
  };

  const selectedBodyObj = useMemo(
    () => bodies.find((body) => String(body.id) === repBodyId),
    [bodies, repBodyId],
  );

  const handleCreateRepresentative = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!repBodyId) {
      setError("Please choose a representative body before assigning a representative.");
      return;
    }

    const responsibilities = allCategories
      ? "*"
      : categories
          .filter((category) => selectedCategoryIds.includes(category.id))
          .map((category) => category.name)
          .join(",");

    if (!allCategories && responsibilities.length === 0) {
      setError("Select at least one category or choose All categories.");
      return;
    }

    void runSave(
      () =>
        institutionAdminService.createRepresentative({
          email: repEmail.trim(),
          bodyId: Number(repBodyId),
          ...(repDepartmentId
            ? { departmentId: Number(repDepartmentId) }
            : selectedBodyObj?.department?.id
              ? { departmentId: selectedBodyObj.department.id }
              : {}),
          ...(repTitle.trim() ? { title: repTitle.trim() } : {}),
          ...(repScopeLevel ? { scopeLevel: Number(repScopeLevel) } : {}),
          ...(repScopeHall.trim() ? { scopeHall: repScopeHall.trim() } : {}),
          responsibilities,
          ...permissions,
        }),
      "Representative assigned successfully.",
    ).then((saved) => {
      if (!saved) return;
      setRepEmail("");
      setRepTitle("");
      setRepBodyId("");
      setRepDepartmentId("");
      setRepScopeLevel("");
      setRepScopeHall("");
      setAllCategories(true);
      setSelectedCategoryIds([]);
      setPermissions(initialPermissions);
      setIsAssigningRep(false);
    });
  };

  const handleRemoveRepresentative = (profileId: number) => {
    if (!window.confirm("Are you sure you want to remove this representative's access?")) return;
    void runSave(
      () => institutionAdminService.removeRepresentative(profileId),
      "Representative removed successfully.",
    );
  };

  const openAssignModalForBody = (body: RepresentativeBody) => {
    setRepBodyId(String(body.id));
    setRepDepartmentId(body.department?.id ? String(body.department.id) : "");
    setIsAssigningRep(true);
  };

  // Filter representatives belonging to currently selected body
  const bodyRepresentatives = useMemo(() => {
    if (!selectedBody) return [];
    return representatives.filter((r) => r.body?.id === selectedBody.id);
  }, [representatives, selectedBody]);

  // Tab styling matching AdminSettings.tsx exactly
  const tabClass = (tab: WorkspaceTab) =>
    `flex shrink-0 items-center gap-2 px-5 py-2.5 rounded-[12px] font-poppins font-semibold text-[13px] sm:text-[14px] border transition-all ${
      activeTab === tab
        ? "bg-[#f49b31] border-[#f49b31] text-white shadow-md shadow-[#f49b31]/10"
        : "bg-white border-[#ffd7a8] text-[#926b3d] hover:bg-[#fef5ea]"
    }`;

  const inputClass =
    "mt-1.5 block w-full rounded-xl border-2 border-[#FFC37B] bg-white px-4 py-2.5 font-['Inter',sans-serif] text-sm text-[#454545] outline-none transition focus:border-[#F49B31] focus:ring-2 focus:ring-[#FFC37B]/20";
  const primaryBtnClass =
    "rounded-full bg-[#f49b31] px-6 py-2.5 font-poppins text-sm font-semibold text-white shadow-sm transition hover:bg-[#e8911a] disabled:cursor-wait disabled:opacity-50";

  return (
    <AdminPageProvider initialPage="institution">
      <div className="min-h-screen w-full min-w-0 bg-[#FCFCFC]">
        <AdminLayout />
        <main
          className={`min-h-screen min-w-0 bg-[#FCFCFC] px-4 py-6 sm:px-8 sm:py-8 ${
            isSidebarCollapsed ? "min-[1131px]:ms-[102px]" : "min-[1131px]:ms-[230px]"
          } transition-all duration-300 pb-24`}
        >
          <div className="flex min-w-0 w-full flex-col items-start gap-6">
            {/* Header Row */}
            <div className="flex flex-col gap-2 items-start relative w-full border-b border-[#ffd7a8] pb-4">
              <div className="flex w-full flex-col items-start gap-1 sm:gap-2">
                <h1 className="hidden min-[1131px]:block font-poppins font-bold text-[24px] sm:text-[32px] leading-normal text-black">
                  Institution
                </h1>
                <AdminHeader title="Institution" />
                <p className="font-poppins font-medium text-[13px] sm:text-[16px] leading-normal text-[#8b8e8d]">
                  Manage your institution, members, representative teams, categories, and posting rules.
                </p>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div
              className="flex overflow-x-auto scrollbar-hide flex-nowrap gap-2 w-full pb-2"
              role="tablist"
              aria-label="Institution tabs"
            >
              {!isRepresentativeManager && (
                <>
                  <button
                    role="tab"
                    aria-selected={activeTab === "departments"}
                    onClick={() => setActiveTab("departments")}
                    className={tabClass("departments")}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    Campus Setup
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === "bodies"}
                    onClick={() => setActiveTab("bodies")}
                    className={tabClass("bodies")}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    Bodies & Committees
                  </button>
                </>
              )}
              <button
                role="tab"
                aria-selected={activeTab === "representatives"}
                onClick={() => setActiveTab("representatives")}
                className={tabClass("representatives")}
              >
                <Sliders className="w-4 h-4 shrink-0" />
                Delegation & Scope
              </button>
              {canManageOrganizationSettings && (
                <>
                  <button
                    role="tab"
                    aria-selected={activeTab === "organization"}
                    onClick={() => setActiveTab("organization")}
                    className={tabClass("organization")}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    Profile
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === "members"}
                    onClick={() => setActiveTab("members")}
                    className={tabClass("members")}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    Members
                  </button>
                  <button
                    role="tab"
                    aria-selected={activeTab === "rules"}
                    onClick={() => setActiveTab("rules")}
                    className={tabClass("rules")}
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    Posting rules
                  </button>
                </>
              )}
            </div>

            {/* Alerts */}
            {error && (
              <div
                role="alert"
                className="w-full rounded-xl border border-red-200 bg-red-50 p-4 font-poppins text-sm text-red-700 flex items-center justify-between"
              >
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-2 underline text-xs">
                  Dismiss
                </button>
              </div>
            )}
            {notice && (
              <div
                role="status"
                className="w-full rounded-xl border border-[#FFC37B] bg-[#FEF5EA] p-4 font-poppins text-sm text-[#75420B] flex items-center justify-between"
              >
                <span>{notice}</span>
                <button onClick={() => setNotice(null)} className="ml-2 underline text-xs">
                  Dismiss
                </button>
              </div>
            )}

            {/* Content Container */}
            {loading ? (
              <div
                role="status"
                className="w-full rounded-[20px] border border-[#ffd7a8] bg-white p-12 text-center font-poppins text-[#8b8e8d]"
              >
                Loading institution workspace…
              </div>
            ) : (
              <div className="flex w-full flex-col gap-6">
                {activeTab === "organization" && canManageOrganizationSettings && (
                  <section className="rounded-[20px] border border-[#ffd7a8] bg-white p-5 sm:p-8">
                    <GeneralSettings />
                  </section>
                )}
                {activeTab === "members" && canManageOrganizationSettings && (
                  <section className="rounded-[20px] border border-[#ffd7a8] bg-white p-5 sm:p-8">
                    <MemberManagement />
                  </section>
                )}
                {activeTab === "rules" && canManageOrganizationSettings && (
                  <section className="rounded-[20px] border border-[#ffd7a8] bg-white p-5 sm:p-8">
                    <RulesSettings />
                  </section>
                )}
                {/* ────────── TAB: ACADEMIC UNITS (DEPARTMENTS) ────────── */}
                {activeTab === "departments" && (
                  <section className="flex flex-col gap-6 w-full animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="font-poppins font-semibold text-[18px] text-[#212121]">
                          Academic Structure
                        </h2>
                        <p className="font-poppins text-[12px] text-[#8b8e8d] mt-1">
                          Create colleges and organize their departments for your institution.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-[#ffd7a8] bg-white p-6 shadow-sm">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-poppins font-semibold text-[16px] text-[#212121]">
                            Colleges
                          </h3>
                          <p className="mt-1 font-poppins text-xs text-[#8b8e8d]">
                            Create colleges and assign departments to keep academic units organized.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setError(null);
                            setIsAddingCollege(true);
                          }}
                          className={primaryBtnClass}
                        >
                          + Add College
                        </button>
                      </div>
                      {colleges.length ? (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[520px] border-collapse text-left font-['Inter',sans-serif] text-sm">
                            <thead>
                              <tr className="border-b border-[#ffd7a8]/50 text-[#8b8e8d] font-poppins text-xs">
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">College Name</th>
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">Code</th>
                                <th className="pb-3 pr-4 text-right font-semibold uppercase tracking-wider">Departments</th>
                                <th className="pb-3 text-right font-semibold uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ffd7a8]/30">
                              {colleges.map((college) => (
                                <tr key={college.id} className="transition-colors hover:bg-[#FEF5EA]/40">
                                  <td className="py-3.5 pr-4 font-medium text-[#212121]">{college.name}</td>
                                  <td className="py-3.5 pr-4">
                                    <span className="inline-block rounded-md bg-[#FEF5EA] px-2.5 py-1 text-xs font-semibold text-[#F49B31]">
                                      {college.code}
                                    </span>
                                  </td>
                                  <td className="py-3.5 pr-4 text-right font-semibold text-[#454545]">
                                    {departments.filter((department) => department.collegeId === college.id).length}
                                  </td>
                                  <td className="py-3.5 text-right">
                                    <button
                                      type="button"
                                      aria-label={`Delete ${college.name}`}
                                      onClick={() => setPendingDelete({ kind: "college", id: college.id })}
                                      className="rounded-full p-2 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-[#FEF5EA] p-6 text-center">
                          <p className="font-poppins text-sm text-[#75420B]">No colleges added yet.</p>
                        </div>
                      )}
                    </div>

                    <div className="rounded-[20px] border border-[#ffd7a8] bg-white p-6 shadow-sm">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-poppins font-semibold text-[16px] text-[#212121]">
                            Departments
                          </h3>
                          <p className="mt-1 font-poppins text-xs text-[#8b8e8d]">
                            Add departments and optionally place each under its college.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setError(null);
                            setIsAddingDepartment(true);
                          }}
                          className={primaryBtnClass}
                        >
                          + Add Department
                        </button>
                      </div>
                      {departments.length ? (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[720px] border-collapse text-left font-['Inter',sans-serif] text-sm">
                            <thead>
                              <tr className="border-b border-[#ffd7a8]/50 text-[#8b8e8d] font-poppins text-xs">
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">
                                  Department Name
                                </th>
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">
                                  Code
                                </th>
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">
                                  College
                                </th>
                                <th className="pb-3 text-right font-semibold uppercase tracking-wider">
                                  Active Pings
                                </th>
                                <th className="pb-3 text-right font-semibold uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ffd7a8]/30">
                              {departments.map((dept) => (
                                <tr
                                  key={dept.id}
                                  className="transition-colors hover:bg-[#FEF5EA]/40"
                                >
                                  <td className="py-3.5 pr-4 font-medium text-[#212121]">
                                    {dept.name}
                                  </td>
                                  <td className="py-3.5 pr-4">
                                    <span className="inline-block rounded-md bg-[#FEF5EA] px-2.5 py-1 text-xs font-semibold text-[#F49B31]">
                                      {dept.code}
                                    </span>
                                  </td>
                                  <td className="py-3.5 pr-4 text-[#454545]">
                                    {dept.college?.code ?? "—"}
                                  </td>
                                  <td className="py-3.5 text-right font-semibold text-[#454545]">
                                    {dept._count?.pings ?? 0}
                                  </td>
                                  <td className="py-3.5 text-right">
                                    <button
                                      type="button"
                                      aria-label={`Delete ${dept.name}`}
                                      onClick={() => setPendingDelete({ kind: "department", id: dept.id })}
                                      className="rounded-full p-2 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-[#FEF5EA] p-6 text-center">
                          <p className="font-poppins text-sm text-[#75420B]">
                            No departments added yet. Add departments like Electrical & Information Engineering (EIE) to start routing issues.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* ────────── TAB: BODIES & COMMITTEES ────────── */}
                {activeTab === "bodies" && (
                  <section className="flex flex-col gap-6 w-full animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="font-poppins font-semibold text-[18px] text-[#212121]">
                          Representative Bodies & Committees
                        </h2>
                        <p className="font-poppins text-[12px] text-[#8b8e8d] mt-1">
                          Official executive councils, hall committees, and departmental bodies (e.g. AEIES). Click any body to inspect its assigned executives and metrics.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingBody(true)}
                        className={primaryBtnClass}
                      >
                        + Create Body
                      </button>
                    </div>

                    {bodies.length ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {bodies.map((body) => {
                          const repCount = representatives.filter((r) => r.body?.id === body.id).length;
                          return (
                            <article
                              key={body.id}
                              onClick={() => setSelectedBody(body)}
                              className="group cursor-pointer rounded-[20px] border border-[#ffd7a8] bg-white p-5 shadow-sm transition-all hover:border-[#F49B31] hover:shadow-md"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="inline-block rounded-md bg-[#FEF5EA] px-2.5 py-0.5 text-xs font-semibold text-[#F49B31] font-poppins">
                                    {body.department?.code ?? "Institution-Wide"}
                                  </span>
                                  <h3 className="mt-2 font-poppins font-bold text-lg text-[#212121] group-hover:text-[#F49B31] transition-colors">
                                    {body.name}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    aria-label={`Delete ${body.name}`}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setPendingDelete({ kind: "body", id: body.id });
                                    }}
                                    className="rounded-full p-2 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                  <div className="rounded-full bg-[#FEF5EA] p-2 text-[#F49B31] group-hover:bg-[#F49B31] group-hover:text-white transition-all">
                                    <ChevronRight size={16} />
                                  </div>
                                </div>
                              </div>

                              <p className="mt-2 font-['Inter',sans-serif] text-xs text-[#8b8e8d] line-clamp-2">
                                {body.description || "No description provided."}
                              </p>

                              <div className="mt-4 border-t border-[#ffd7a8]/40 pt-3 flex items-center justify-between text-xs font-poppins text-[#75420B]">
                                <span>👥 {repCount} {repCount === 1 ? "representative" : "representatives"}</span>
                                <span>📌 {body._count?.assignedPings ?? 0} assigned</span>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-[20px] border border-[#ffd7a8] bg-white p-8 text-center">
                        <p className="font-poppins text-sm text-[#75420B]">
                          No representative bodies created yet. Create bodies like AEIES or Student Council.
                        </p>
                      </div>
                    )}
                  </section>
                )}

                {/* ────────── TAB: DELEGATION & SCOPE ────────── */}
                {activeTab === "representatives" && (
                  <section className="flex flex-col gap-6 w-full animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="font-poppins font-semibold text-[18px] text-[#212121]">
                          Representative Delegation & Scope
                        </h2>
                        <p className="font-poppins text-[12px] text-[#8b8e8d] mt-1">
                          Empower student leaders with specific departmental and category authority without exposing university-wide administrative controls.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAssigningRep(true)}
                        disabled={bodies.length === 0}
                        className={primaryBtnClass}
                      >
                        + Assign Representative
                      </button>
                    </div>

                    <div className="rounded-[20px] border border-[#ffd7a8] bg-white p-6 shadow-sm">
                      {representatives.length ? (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[700px] border-collapse text-left font-['Inter',sans-serif] text-sm">
                            <thead>
                              <tr className="border-b border-[#ffd7a8]/50 text-[#8b8e8d] font-poppins text-xs">
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">
                                  Representative
                                </th>
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">
                                  Body
                                </th>
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">
                                  Department
                                </th>
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">
                                  Category Scope
                                </th>
                                <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">
                                  Permissions
                                </th>
                                <th className="pb-3 text-right font-semibold uppercase tracking-wider">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ffd7a8]/30">
                              {representatives.map((rep) => (
                                <tr
                                  key={rep.id}
                                  className="transition-colors hover:bg-[#FEF5EA]/40"
                                >
                                  <td className="py-3.5 pr-4">
                                    <span className="block font-medium text-[#212121]">
                                      {rep.user.firstName} {rep.user.lastName}
                                    </span>
                                    <span className="text-xs text-[#8b8e8d]">
                                      {rep.user.email}
                                    </span>
                                    {rep.title && (
                                      <span className="block text-xs font-semibold text-[#F49B31]">
                                        {rep.title}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3.5 pr-4">
                                    <button
                                      type="button"
                                      onClick={() => rep.body && setSelectedBody(rep.body)}
                                      className="font-medium text-[#F49B31] hover:underline"
                                    >
                                      {rep.body?.name ?? "—"}
                                    </button>
                                  </td>
                                  <td className="py-3.5 pr-4 text-[#454545]">
                                    {rep.department?.name ?? "All departments"}
                                  </td>
                                  <td className="py-3.5 pr-4">
                                    <span className="inline-block rounded-full bg-[#FEF5EA] px-2.5 py-0.5 text-xs text-[#75420B] font-medium">
                                      {rep.responsibilities === "*"
                                        ? "All categories"
                                        : rep.responsibilities.split(",").join(", ")}
                                    </span>
                                  </td>
                                  <td className="py-3.5 pr-4">
                                    <div className="flex flex-wrap gap-1">
                                      {rep.canAssign && (
                                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                                          Assign
                                        </span>
                                      )}
                                      {rep.canRespond && (
                                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                                          Respond
                                        </span>
                                      )}
                                      {rep.canResolve && (
                                        <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 border border-purple-200">
                                          Resolve
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3.5 text-right">
                                    {rep.userId === user?.id ? (
                                      <span className="inline-flex rounded-full bg-black/5 px-3 py-1 font-poppins text-xs font-medium text-black/40">
                                        You
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveRepresentative(rep.id)}
                                        disabled={saving}
                                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-[#FEF5EA] p-6 text-center">
                          <p className="font-poppins text-sm text-[#75420B]">
                            No representatives assigned yet. Create a body like AEIES and assign executive members.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* ────────── TAB: PING CATEGORIES ────────── */}
                {activeTab === "departments" && (
                  <section className="flex flex-col gap-6 w-full animate-fade-in">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="font-poppins font-semibold text-[18px] text-[#212121]">
                          Ping Categories
                        </h2>
                        <p className="font-poppins text-[12px] text-[#8b8e8d] mt-1">
                          Categories organize community Pings and define representative responsibilities.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setError(null);
                          setIsAddingCategory(true);
                        }}
                        className={primaryBtnClass}
                      >
                        + Add Category
                      </button>
                    </div>

                    <div className="rounded-[20px] border border-[#ffd7a8] bg-white p-6 shadow-sm">
                        {categories.length ? (
                          <ul className="grid gap-2.5 sm:grid-cols-2">
                            {categories.map((category) => (
                              <li
                                key={category.id}
                                className="rounded-xl border border-[#ffd7a8]/50 bg-[#FEF5EA]/30 p-3.5 flex items-center justify-between gap-2"
                              >
                                {editingCategoryId === category.id ? (
                                  <form
                                    onSubmit={handleRenameCategory}
                                    className="flex w-full items-center gap-2"
                                  >
                                    <input
                                      required
                                      maxLength={100}
                                      value={editingCategoryName}
                                      onChange={(e) => setEditingCategoryName(e.target.value)}
                                      className="flex-1 rounded-lg border-2 border-[#FFC37B] px-3 py-1.5 text-sm"
                                    />
                                    <button
                                      type="submit"
                                      disabled={saving}
                                      className="rounded-full bg-[#f49b31] px-3 py-1.5 text-xs font-semibold text-white"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCategoryId(null);
                                        setEditingCategoryName("");
                                      }}
                                      className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                                    >
                                      Cancel
                                    </button>
                                  </form>
                                ) : (
                                  <>
                                    <span className="font-poppins font-medium text-sm text-[#212121]">
                                      {category.name}
                                    </span>
                                    <div className="flex shrink-0 items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingCategoryId(category.id);
                                          setEditingCategoryName(category.name);
                                        }}
                                        className="rounded-full border border-[#ffd7a8] px-3 py-1 text-xs font-semibold text-[#75420B] hover:bg-[#FEF5EA]"
                                      >
                                        Rename
                                      </button>
                                      <button
                                        type="button"
                                        aria-label={`Delete ${category.name}`}
                                        onClick={() => setPendingDelete({ kind: "category", id: category.id })}
                                        className="rounded-full p-2 text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-[#8b8e8d]">No categories available.</p>
                        )}
                    </div>
                  </section>
                )}

                {/* ────────── TAB: PING CONTEXT CHOICES (HALLS & LEVELS) ────────── */}
                {activeTab === "departments" && (
                  <form
                    onSubmit={handleSaveContextOptions}
                    className="flex flex-col gap-6 w-full animate-fade-in"
                  >
                    <div>
                      <h2 className="font-poppins font-semibold text-[18px] text-[#212121]">
                        Ping Context Choices (Halls & Levels)
                      </h2>
                      <p className="font-poppins text-[12px] text-[#8b8e8d] mt-1">
                        These dynamic options populate the student Ping composer. Nothing is hardcoded; what you save here is live across campus.
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Halls Card */}
                      <div className="rounded-[20px] border border-[#ffd7a8] bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-poppins font-semibold text-[#212121]">
                              Halls of Residence
                            </h3>
                            <p className="mt-1 font-['Inter',sans-serif] text-xs text-[#8b8e8d]">
                              Add halls or residential blocks available on your campus.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setError(null);
                              setIsAddingHalls(true);
                            }}
                            className={primaryBtnClass}
                          >
                            + Add Halls
                          </button>
                        </div>

                        <ul className="mt-4 flex flex-wrap gap-2">
                          {hallOptions.map((hall) => (
                            <li
                              key={hall}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC37B] bg-[#FEF5EA] py-1 pl-3 pr-1.5 font-poppins text-xs font-medium text-[#75420B]"
                            >
                              {hall}
                              <button
                                type="button"
                                aria-label={`Remove ${hall}`}
                                onClick={() =>
                                  setHallOptions((current) => current.filter((h) => h !== hall))
                                }
                                className="rounded-full px-1.5 py-0.5 hover:bg-[#FFC37B]"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                          {!hallOptions.length && (
                            <li className="font-poppins text-xs text-[#8b8e8d]">
                              No halls configured.
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Levels Card */}
                      <div className="rounded-[20px] border border-[#ffd7a8] bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-poppins font-semibold text-[#212121]">
                              Academic Levels
                            </h3>
                            <p className="mt-1 font-['Inter',sans-serif] text-xs text-[#8b8e8d]">
                              Study years available for issue tagging.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setError(null);
                              setIsAddingLevels(true);
                            }}
                            className={primaryBtnClass}
                          >
                            + Add Levels
                          </button>
                        </div>

                        <ul className="mt-4 flex flex-wrap gap-2">
                          {levelOptions.map((level) => (
                            <li
                              key={level}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC37B] bg-[#FEF5EA] py-1 pl-3 pr-1.5 font-poppins text-xs font-medium text-[#75420B]"
                            >
                              {level}L
                              <button
                                type="button"
                                aria-label={`Remove ${level}L`}
                                onClick={() =>
                                  setLevelOptions((current) => current.filter((l) => l !== level))
                                }
                                className="rounded-full px-1.5 py-0.5 hover:bg-[#FFC37B]"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                          {!levelOptions.length && (
                            <li className="font-poppins text-xs text-[#8b8e8d]">
                              No levels configured.
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <button type="submit" disabled={saving} className={`${primaryBtnClass} w-fit`}>
                      {saving ? "Saving…" : "Save Ping Context"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </main>

        {/* ────────── MODAL: BODY DRILL-DOWN & DETAILS (e.g. AEIES) ────────── */}
        {selectedBody && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setSelectedBody(null)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-[#ffd7a8] bg-white p-6 sm:p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#ffd7a8]/50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#FEF5EA] px-2.5 py-0.5 text-xs font-semibold text-[#F49B31] font-poppins">
                      {selectedBody.department?.code
                        ? `${selectedBody.department.name} (${selectedBody.department.code})`
                        : "Institution-Wide Body"}
                    </span>
                  </div>
                  <h2 className="mt-2 font-poppins font-bold text-2xl text-[#212121]">
                    {selectedBody.name}
                  </h2>
                  {selectedBody.description && (
                    <p className="mt-1 font-['Inter',sans-serif] text-sm text-[#8b8e8d]">
                      {selectedBody.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBody(null)}
                  className="rounded-full p-2 text-black/40 hover:bg-[#FEF5EA] hover:text-black transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-[#ffd7a8]/60 bg-[#FEF5EA]/40 p-4">
                  <span className="block font-poppins text-xs font-medium text-[#8b8e8d]">
                    Assigned Executives
                  </span>
                  <span className="mt-1 block font-poppins text-2xl font-bold text-[#F49B31]">
                    {bodyRepresentatives.length}
                  </span>
                </div>
                <div className="rounded-xl border border-[#ffd7a8]/60 bg-[#FEF5EA]/40 p-4">
                  <span className="block font-poppins text-xs font-medium text-[#8b8e8d]">
                    Assigned Issues
                  </span>
                  <span className="mt-1 block font-poppins text-2xl font-bold text-[#212121]">
                    {selectedBody._count?.assignedPings ?? 0}
                  </span>
                </div>
                <div className="rounded-xl border border-[#ffd7a8]/60 bg-[#FEF5EA]/40 p-4 col-span-2 sm:col-span-1">
                  <span className="block font-poppins text-xs font-medium text-[#8b8e8d]">
                    Target Scope
                  </span>
                  <span className="mt-1 block font-poppins text-sm font-semibold text-[#212121]">
                    {selectedBody.department?.code ?? "All Campus"}
                  </span>
                </div>
              </div>

              {/* Assigned People Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="font-poppins font-semibold text-lg text-[#212121]">
                    Assigned Representatives ({bodyRepresentatives.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      openAssignModalForBody(selectedBody);
                      setSelectedBody(null);
                    }}
                    className="font-poppins text-xs font-semibold text-[#F49B31] hover:underline"
                  >
                    + Add Executive
                  </button>
                </div>

                {bodyRepresentatives.length ? (
                  <div className="divide-y divide-[#ffd7a8]/40 border border-[#ffd7a8]/40 rounded-xl overflow-hidden">
                    {bodyRepresentatives.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-[#FEF5EA]/20 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-poppins font-semibold text-sm text-[#212121]">
                              {rep.user.firstName} {rep.user.lastName}
                            </span>
                            {rep.title && (
                              <span className="rounded bg-[#FEF5EA] px-2 py-0.5 text-xs font-semibold text-[#F49B31]">
                                {rep.title}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#8b8e8d]">{rep.user.email}</span>
                          <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs text-[#75420B]">
                            <span className="rounded bg-[#FEF5EA] px-2 py-0.5">
                              Scope: {rep.responsibilities === "*" ? "All categories" : rep.responsibilities}
                            </span>
                            {rep.scopeLevel && (
                              <span className="rounded bg-[#FEF5EA] px-2 py-0.5">
                                {rep.scopeLevel}L
                              </span>
                            )}
                            {rep.scopeHall && (
                              <span className="rounded bg-[#FEF5EA] px-2 py-0.5">
                                {rep.scopeHall}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {rep.userId === user?.id ? (
                            <span className="rounded-full bg-black/5 px-3 py-1 font-poppins text-xs font-medium text-black/40">
                              You
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRemoveRepresentative(rep.id)}
                              className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#FEF5EA] p-6 text-center">
                    <p className="font-poppins text-sm text-[#75420B]">
                      No representatives currently assigned to {selectedBody.name}.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        openAssignModalForBody(selectedBody);
                        setSelectedBody(null);
                      }}
                      className={`${primaryBtnClass} mt-3 text-xs`}
                    >
                      Assign First Executive
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ────────── MODAL: ADD DEPARTMENT ────────── */}
        {isAddingDepartment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setIsAddingDepartment(false)}
          >
            <div
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-[#ffd7a8] bg-white p-6 sm:p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#ffd7a8]/50 pb-3">
                <h3 className="font-poppins font-bold text-lg text-[#212121]">Add Department</h3>
                <button
                  type="button"
                  onClick={() => setIsAddingDepartment(false)}
                  className="rounded-full p-1 text-black/40 hover:bg-[#FEF5EA]"
                >
                  <X size={18} />
                </button>
              </div>
              {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
              <form onSubmit={handleCreateDepartment} className="mt-4 flex flex-col gap-4">
                <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
                  {departmentDrafts.map((draft, index) => (
                    <fieldset
                      key={index}
                      className="rounded-xl border border-[#ffd7a8]/60 bg-[#FEF5EA]/30 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <legend className="font-poppins text-sm font-semibold text-[#212121]">
                          Department {index + 1}
                        </legend>
                        {departmentDrafts.length > 1 && (
                          <button
                            type="button"
                            aria-label={`Remove department ${index + 1}`}
                            onClick={() =>
                              setDepartmentDrafts((current) =>
                                current.filter((_, draftIndex) => draftIndex !== index),
                              )
                            }
                            className="rounded-full p-1.5 text-red-600 hover:bg-red-50"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <label className="block font-poppins text-xs font-medium text-[#454545]">
                        Department Name
                        <input
                          required
                          maxLength={160}
                          value={draft.name}
                          onChange={(event) =>
                            setDepartmentDrafts((current) =>
                              current.map((item, draftIndex) =>
                                draftIndex === index ? { ...item, name: event.target.value } : item,
                              ),
                            )
                          }
                          placeholder="e.g. Electrical & Information Engineering"
                          className={inputClass}
                        />
                      </label>
                      <label className="mt-3 block font-poppins text-xs font-medium text-[#454545]">
                        Short Code
                        <input
                          required
                          maxLength={32}
                          value={draft.code}
                          onChange={(event) =>
                            setDepartmentDrafts((current) =>
                              current.map((item, draftIndex) =>
                                draftIndex === index ? { ...item, code: event.target.value } : item,
                              ),
                            )
                          }
                          placeholder="e.g. EIE"
                          className={inputClass}
                        />
                      </label>
                      <label className="mt-3 block font-poppins text-xs font-medium text-[#454545]">
                        College (optional)
                        <select
                          value={draft.collegeId}
                          onChange={(event) =>
                            setDepartmentDrafts((current) =>
                              current.map((item, draftIndex) =>
                                draftIndex === index
                                  ? { ...item, collegeId: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          className={inputClass}
                        >
                          <option value="">No college</option>
                          {colleges.map((college) => (
                            <option key={college.id} value={college.id}>
                              {college.name} ({college.code})
                            </option>
                          ))}
                        </select>
                      </label>
                    </fieldset>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setDepartmentDrafts((current) => [...current, createDepartmentDraft()])}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f49b31] bg-[#FEF5EA] px-4 py-2 font-poppins text-xs font-semibold text-[#75420B] hover:bg-[#FFC37B]"
                >
                  <Plus size={16} /> Add another department
                </button>
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingDepartment(false)}
                    className="rounded-full border border-black/15 px-5 py-2 font-poppins text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className={primaryBtnClass}>
                    {saving ? "Saving…" : `Add ${departmentDrafts.length} Department${departmentDrafts.length === 1 ? "" : "s"}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ────────── MODAL: ADD COLLEGE ────────── */}
        {isAddingCollege && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setIsAddingCollege(false)}
          >
            <div
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-[#ffd7a8] bg-white p-6 sm:p-8 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#ffd7a8]/50 pb-3">
                <h3 className="font-poppins font-bold text-lg text-[#212121]">Add Colleges</h3>
                <button
                  type="button"
                  onClick={() => setIsAddingCollege(false)}
                  className="rounded-full p-1 text-black/40 hover:bg-[#FEF5EA]"
                  aria-label="Close add college dialog"
                >
                  <X size={18} />
                </button>
              </div>
              {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
              <form onSubmit={handleCreateCollege} className="mt-4 flex flex-col gap-4">
                <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
                  {collegeDrafts.map((draft, index) => (
                    <fieldset
                      key={index}
                      className="rounded-xl border border-[#ffd7a8]/60 bg-[#FEF5EA]/30 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <legend className="font-poppins text-sm font-semibold text-[#212121]">
                          College {index + 1}
                        </legend>
                        {collegeDrafts.length > 1 && (
                          <button
                            type="button"
                            aria-label={`Remove college ${index + 1}`}
                            onClick={() =>
                              setCollegeDrafts((current) =>
                                current.filter((_, draftIndex) => draftIndex !== index),
                              )
                            }
                            className="rounded-full p-1.5 text-red-600 hover:bg-red-50"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <label className="block font-poppins text-xs font-medium text-[#454545]">
                        College Name
                        <input
                          required
                          maxLength={160}
                          value={draft.name}
                          onChange={(event) =>
                            setCollegeDrafts((current) =>
                              current.map((item, draftIndex) =>
                                draftIndex === index ? { ...item, name: event.target.value } : item,
                              ),
                            )
                          }
                          placeholder="e.g. College of Engineering"
                          className={inputClass}
                        />
                      </label>
                      <label className="mt-3 block font-poppins text-xs font-medium text-[#454545]">
                        Short Code
                        <input
                          required
                          maxLength={32}
                          value={draft.code}
                          onChange={(event) =>
                            setCollegeDrafts((current) =>
                              current.map((item, draftIndex) =>
                                draftIndex === index ? { ...item, code: event.target.value } : item,
                              ),
                            )
                          }
                          placeholder="e.g. COE"
                          className={inputClass}
                        />
                      </label>
                    </fieldset>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCollegeDrafts((current) => [...current, createCollegeDraft()])}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f49b31] bg-[#FEF5EA] px-4 py-2 font-poppins text-xs font-semibold text-[#75420B] hover:bg-[#FFC37B]"
                >
                  <Plus size={16} /> Add another college
                </button>
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCollege(false)}
                    className="rounded-full border border-black/15 px-5 py-2 font-poppins text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className={primaryBtnClass}>
                    {saving ? "Saving…" : `Add ${collegeDrafts.length} College${collegeDrafts.length === 1 ? "" : "s"}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAddingCategory && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setIsAddingCategory(false)}
          >
            <div
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-[#ffd7a8] bg-white p-6 shadow-xl sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#ffd7a8]/50 pb-3">
                <h3 className="font-poppins text-lg font-bold text-[#212121]">Add Categories</h3>
                <button
                  type="button"
                  aria-label="Close add categories dialog"
                  onClick={() => setIsAddingCategory(false)}
                  className="rounded-full p-1 text-black/40 hover:bg-[#FEF5EA]"
                >
                  <X size={18} />
                </button>
              </div>
              {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
              <form onSubmit={handleCreateCategory} className="mt-4 flex flex-col gap-4">
                <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                  {categoryDrafts.map((draft, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <label className="block flex-1 font-poppins text-xs font-medium text-[#454545]">
                        Category {index + 1}
                        <input
                          required
                          maxLength={100}
                          value={draft}
                          onChange={(event) =>
                            setCategoryDrafts((current) =>
                              current.map((name, draftIndex) =>
                                draftIndex === index ? event.target.value : name,
                              ),
                            )
                          }
                          placeholder="e.g. Facilities"
                          className={inputClass}
                        />
                      </label>
                      {categoryDrafts.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Remove category ${index + 1}`}
                          onClick={() =>
                            setCategoryDrafts((current) =>
                              current.filter((_, draftIndex) => draftIndex !== index),
                            )
                          }
                          className="mb-1 rounded-full p-2 text-red-600 hover:bg-red-50"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCategoryDrafts((current) => [...current, ""])}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f49b31] bg-[#FEF5EA] px-4 py-2 font-poppins text-xs font-semibold text-[#75420B] hover:bg-[#FFC37B]"
                >
                  <Plus size={16} /> Add another category
                </button>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="rounded-full border border-black/15 px-5 py-2 font-poppins text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className={primaryBtnClass}>
                    {saving ? "Saving…" : `Add ${categoryDrafts.length} Categor${categoryDrafts.length === 1 ? "y" : "ies"}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAddingHalls && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setIsAddingHalls(false)}
          >
            <div
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-[#ffd7a8] bg-white p-6 shadow-xl sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#ffd7a8]/50 pb-3">
                <h3 className="font-poppins text-lg font-bold text-[#212121]">Add Halls</h3>
                <button
                  type="button"
                  aria-label="Close add halls dialog"
                  onClick={() => setIsAddingHalls(false)}
                  className="rounded-full p-1 text-black/40 hover:bg-[#FEF5EA]"
                >
                  <X size={18} />
                </button>
              </div>
              {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
              <form onSubmit={handleCreateHalls} className="mt-4 flex flex-col gap-4">
                <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                  {hallDrafts.map((draft, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <label className="block flex-1 font-poppins text-xs font-medium text-[#454545]">
                        Hall {index + 1}
                        <input
                          required
                          maxLength={100}
                          value={draft}
                          onChange={(event) =>
                            setHallDrafts((current) =>
                              current.map((hall, draftIndex) =>
                                draftIndex === index ? event.target.value : hall,
                              ),
                            )
                          }
                          placeholder="e.g. Daniel Hall"
                          className={inputClass}
                        />
                      </label>
                      {hallDrafts.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Remove hall ${index + 1}`}
                          onClick={() =>
                            setHallDrafts((current) =>
                              current.filter((_, draftIndex) => draftIndex !== index),
                            )
                          }
                          className="mb-1 rounded-full p-2 text-red-600 hover:bg-red-50"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setHallDrafts((current) => [...current, ""])}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f49b31] bg-[#FEF5EA] px-4 py-2 font-poppins text-xs font-semibold text-[#75420B] hover:bg-[#FFC37B]"
                >
                  <Plus size={16} /> Add another hall
                </button>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingHalls(false)}
                    className="rounded-full border border-black/15 px-5 py-2 font-poppins text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className={primaryBtnClass}>
                    {saving ? "Saving…" : `Add ${hallDrafts.length} Hall${hallDrafts.length === 1 ? "" : "s"}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAddingLevels && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setIsAddingLevels(false)}
          >
            <div
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-[#ffd7a8] bg-white p-6 shadow-xl sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#ffd7a8]/50 pb-3">
                <h3 className="font-poppins text-lg font-bold text-[#212121]">Add Academic Levels</h3>
                <button
                  type="button"
                  aria-label="Close add academic levels dialog"
                  onClick={() => setIsAddingLevels(false)}
                  className="rounded-full p-1 text-black/40 hover:bg-[#FEF5EA]"
                >
                  <X size={18} />
                </button>
              </div>
              {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
              <form onSubmit={handleCreateLevels} className="mt-4 flex flex-col gap-4">
                <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                  {levelDrafts.map((draft, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <label className="block flex-1 font-poppins text-xs font-medium text-[#454545]">
                        Level {index + 1}
                        <input
                          required
                          inputMode="numeric"
                          value={draft}
                          onChange={(event) =>
                            setLevelDrafts((current) =>
                              current.map((level, draftIndex) =>
                                draftIndex === index
                                  ? event.target.value.replace(/\D/g, "").slice(0, 4)
                                  : level,
                              ),
                            )
                          }
                          placeholder="e.g. 700"
                          className={inputClass}
                        />
                      </label>
                      {levelDrafts.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Remove level ${index + 1}`}
                          onClick={() =>
                            setLevelDrafts((current) =>
                              current.filter((_, draftIndex) => draftIndex !== index),
                            )
                          }
                          className="mb-1 rounded-full p-2 text-red-600 hover:bg-red-50"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setLevelDrafts((current) => [...current, ""])}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f49b31] bg-[#FEF5EA] px-4 py-2 font-poppins text-xs font-semibold text-[#75420B] hover:bg-[#FFC37B]"
                >
                  <Plus size={16} /> Add another level
                </button>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingLevels(false)}
                    className="rounded-full border border-black/15 px-5 py-2 font-poppins text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className={primaryBtnClass}>
                    {saving ? "Saving…" : `Add ${levelDrafts.length} Level${levelDrafts.length === 1 ? "" : "s"}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ────────── MODAL: CREATE BODY ────────── */}
        {isAddingBody && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setIsAddingBody(false)}
          >
            <div
              className="relative w-full max-w-md rounded-[24px] border border-[#ffd7a8] bg-white p-6 sm:p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#ffd7a8]/50 pb-3">
                <h3 className="font-poppins font-bold text-lg text-[#212121]">
                  Create Representative Body
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingBody(false)}
                  className="rounded-full p-1 text-black/40 hover:bg-[#FEF5EA]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateBody} className="mt-4 flex flex-col gap-4">
                <label className="block font-poppins text-xs font-medium text-[#454545]">
                  Body Name
                  <input
                    required
                    maxLength={160}
                    value={bodyName}
                    onChange={(e) => setBodyName(e.target.value)}
                    placeholder="e.g. AEIES, Student Council"
                    className={inputClass}
                  />
                </label>
                <label className="block font-poppins text-xs font-medium text-[#454545]">
                  Associated Department (optional)
                  <select
                    value={bodyDepartmentId}
                    onChange={(e) => setBodyDepartmentId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Institution-Wide (No specific department)</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block font-poppins text-xs font-medium text-[#454545]">
                  Description (optional)
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={bodyDescription}
                    onChange={(e) => setBodyDescription(e.target.value)}
                    placeholder="Describe the jurisdiction and role of this council..."
                    className={inputClass}
                  />
                </label>
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingBody(false)}
                    className="rounded-full border border-black/15 px-5 py-2 font-poppins text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className={primaryBtnClass}>
                    {saving ? "Saving…" : "Create Body"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ────────── MODAL: ASSIGN REPRESENTATIVE ────────── */}
        {isAssigningRep && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
            onClick={() => setIsAssigningRep(false)}
          >
            <div
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-[#ffd7a8] bg-white p-6 sm:p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#ffd7a8]/50 pb-3">
                <h3 className="font-poppins font-bold text-lg text-[#212121]">
                  Assign Representative
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAssigningRep(false)}
                  className="rounded-full p-1 text-black/40 hover:bg-[#FEF5EA]"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateRepresentative} className="mt-4 flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block font-poppins text-xs font-medium text-[#454545]">
                    Institutional Email
                    <input
                      required
                      type="email"
                      maxLength={200}
                      value={repEmail}
                      onChange={(e) => setRepEmail(e.target.value)}
                      placeholder="student@institution.edu"
                      className={inputClass}
                    />
                  </label>
                  <label className="block font-poppins text-xs font-medium text-[#454545]">
                    Title / Position
                    <input
                      maxLength={160}
                      value={repTitle}
                      onChange={(e) => setRepTitle(e.target.value)}
                      placeholder="e.g. Academic Officer"
                      className={inputClass}
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block font-poppins text-xs font-medium text-[#454545]">
                    Representative Body
                    <select
                      required
                      value={repBodyId}
                      onChange={(e) => {
                        setRepBodyId(e.target.value);
                        const b = bodies.find((item) => String(item.id) === e.target.value);
                        setRepDepartmentId(b?.department?.id ? String(b.department.id) : "");
                      }}
                      className={inputClass}
                    >
                      <option value="">Select a body</option>
                      {bodies.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block font-poppins text-xs font-medium text-[#454545]">
                    Department Scope
                    <select
                      value={repDepartmentId}
                      onChange={(e) => setRepDepartmentId(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Use body scope / All departments</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block font-poppins text-xs font-medium text-[#454545]">
                    Level Scope (optional)
                    <select
                      value={repScopeLevel}
                      onChange={(e) => setRepScopeLevel(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Any level</option>
                      {levelOptions.map((level) => (
                        <option key={level} value={level}>
                          {level}L
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block font-poppins text-xs font-medium text-[#454545]">
                    Hall Scope (optional)
                    <select
                      value={repScopeHall}
                      onChange={(e) => setRepScopeHall(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Any hall</option>
                      {hallOptions.map((hall) => (
                        <option key={hall} value={hall}>
                          {hall}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Categories */}
                <fieldset className="rounded-xl border border-[#ffd7a8]/60 bg-[#FEF5EA]/30 p-4">
                  <legend className="font-poppins text-xs font-semibold text-[#212121]">
                    Category Responsibilities
                  </legend>
                  <label className="mt-2 inline-flex items-center gap-2 font-poppins text-xs font-medium text-[#454545]">
                    <input
                      type="checkbox"
                      checked={allCategories}
                      onChange={(e) => {
                        setAllCategories(e.target.checked);
                        if (e.target.checked) setSelectedCategoryIds([]);
                      }}
                      className="accent-[#F49B31]"
                    />
                    All categories
                  </label>

                  {!allCategories && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <label
                          key={cat.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC37B] bg-white px-3 py-1 font-poppins text-xs text-[#75420B]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(cat.id)}
                            onChange={(e) =>
                              setSelectedCategoryIds((curr) =>
                                e.target.checked ? [...curr, cat.id] : curr.filter((id) => id !== cat.id),
                              )
                            }
                            className="accent-[#F49B31]"
                          />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  )}
                  {allCategories && (
                    <button
                      type="button"
                      onClick={() => setAllCategories(false)}
                      className="mt-1 block font-poppins text-xs text-[#F49B31] underline"
                    >
                      Choose specific categories
                    </button>
                  )}
                </fieldset>

                {/* Permissions Switches */}
                <fieldset className="rounded-xl border border-[#ffd7a8]/60 bg-[#FEF5EA]/30 p-4">
                  <legend className="font-poppins text-xs font-semibold text-[#212121]">
                    Permissions
                  </legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        ["canAssign", "Can assign issues to reps/bodies"],
                        ["canRespond", "Can publish official responses"],
                        ["canAcknowledge", "Can acknowledge issues"],
                        ["canModerateWaves", "Can approve, reject or review waves"],
                        ["canUpdateWaveProgress", "Can mark waves in progress or completed"],
                        ["canResolve", "Can resolve issues"],
                        ["canExport", "Can export data to CSV"],
                        ["canManageReps", "Can manage other reps"],
                      ] as const
                    ).map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 rounded-lg border border-[#ffd7a8]/50 bg-white p-2.5 font-poppins text-xs text-[#454545]"
                      >
                        <input
                          type="checkbox"
                          checked={permissions[key]}
                          onChange={(e) =>
                            setPermissions((curr) => ({ ...curr, [key]: e.target.checked }))
                          }
                          className="accent-[#F49B31]"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAssigningRep(false)}
                    className="rounded-full border border-black/15 px-5 py-2 font-poppins text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className={primaryBtnClass}>
                    {saving ? "Assigning…" : "Assign Representative"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {pendingDelete && (
          <DeleteConfirmationModal
            itemType={
              pendingDelete.kind === "category"
                ? "Category"
                : pendingDelete.kind === "college"
                  ? "College"
                  : pendingDelete.kind === "department"
                    ? "Department"
                    : "Body"
            }
            isLoading={saving}
            onCancel={() => setPendingDelete(null)}
            onConfirm={() => void handleConfirmDelete()}
          />
        )}
      </div>
    </AdminPageProvider>
  );
};

export default InstitutionWorkspace;
