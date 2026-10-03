import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore, useUIStore } from "../../stores";
import { categoryService } from "../../api/services";
import type { CategoryData } from "../../api/types";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import { AdminPageProvider } from "../../contexts/AdminPageContext";
import institutionAdminService, {
  type AcademicDepartment,
  type RepresentativeBody,
  type RepresentativePermissions,
  type RepresentativeProfile,
} from "../../api/services/institutionAdmin.service";

type WorkspaceTab = "departments" | "bodies" | "representatives" | "categories" | "context";

const initialPermissions: RepresentativePermissions = {
  canRespond: false,
  canAcknowledge: false,
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
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(
    isRepresentativeManager ? "representatives" : "departments",
  );
  const [departments, setDepartments] = useState<AcademicDepartment[]>([]);
  const [bodies, setBodies] = useState<RepresentativeBody[]>([]);
  const [representatives, setRepresentatives] = useState<RepresentativeProfile[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
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
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [hallOptions, setHallOptions] = useState<string[]>([]);
  const [levelOptions, setLevelOptions] = useState<number[]>([]);
  const [hallDraft, setHallDraft] = useState("");
  const [levelDraft, setLevelDraft] = useState("");

  const refresh = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (!organizationId) {
        throw new Error("Your institution context is unavailable.");
      }
      const [departmentList, bodyList, representativeList, categoryList, contextOptions] =
        await Promise.all([
          institutionAdminService.getDepartments(),
          institutionAdminService.getBodies(),
          institutionAdminService.getRepresentatives(),
          categoryService.getAll(),
          institutionAdminService.getContextOptions(organizationId),
        ]);
      setDepartments(departmentList);
      setBodies(bodyList);
      setRepresentatives(representativeList);
      setCategories(categoryList);
      setHallOptions(contextOptions.halls);
      setLevelOptions(contextOptions.levels);
      return true;
    } catch (loadError) {
      console.error("Failed to load institution management data:", loadError);
      const responseData = (
        loadError as { response?: { data?: { error?: string; message?: string } } }
      )?.response?.data;
      setError(responseData?.error || responseData?.message || "We couldn't load institution management. Please refresh and try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
        setNotice(`${message} The list could not be refreshed; use Refresh to check the latest values.`);
      }
      return true;
    } catch (saveError) {
      console.error("Institution management update failed:", saveError);
      const responseData = (
        saveError as { response?: { data?: { error?: string; message?: string } } }
      )?.response?.data;
      setError(responseData?.error || responseData?.message || "We couldn't save this change. Please check the details and try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleCreateDepartment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSave(
      () => institutionAdminService.createDepartment({
        name: departmentName.trim(),
        code: departmentCode.trim(),
      }),
      "Department added.",
    ).then((saved) => {
      if (!saved) return;
      setDepartmentName("");
      setDepartmentCode("");
    });
  };

  const handleCreateBody = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSave(
      () => institutionAdminService.createBody({
        name: bodyName.trim(),
        ...(bodyDepartmentId ? { departmentId: Number(bodyDepartmentId) } : {}),
        ...(bodyDescription.trim() ? { description: bodyDescription.trim() } : {}),
      }),
      "Representative body created.",
    ).then((saved) => {
      if (!saved) return;
      setBodyName("");
      setBodyDepartmentId("");
      setBodyDescription("");
    });
  };

  const handleCreateCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;
    void runSave(
      () => categoryService.create(name),
      "Category added.",
    ).then((saved) => {
      if (saved) setCategoryName("");
    });
  };

  const handleRenameCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingCategoryId === null || !editingCategoryName.trim()) return;
    void runSave(
      () => categoryService.updateName(editingCategoryId, editingCategoryName.trim()),
      "Category renamed.",
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
      () => institutionAdminService.updateContextOptions({
        halls: hallOptions,
        levels: levelOptions,
      }),
      "Ping context options saved.",
    );
  };

  const selectedBody = useMemo(
    () => bodies.find((body) => String(body.id) === repBodyId),
    [bodies, repBodyId],
  );

  const handleCreateRepresentative = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!repBodyId) {
      setError("Choose a representative body before assigning a representative.");
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
      () => institutionAdminService.createRepresentative({
        email: repEmail.trim(),
        bodyId: Number(repBodyId),
        ...(repDepartmentId
          ? { departmentId: Number(repDepartmentId) }
          : selectedBody?.department?.id
            ? { departmentId: selectedBody.department.id }
            : {}),
        ...(repTitle.trim() ? { title: repTitle.trim() } : {}),
        ...(repScopeLevel ? { scopeLevel: Number(repScopeLevel) } : {}),
        ...(repScopeHall.trim() ? { scopeHall: repScopeHall.trim() } : {}),
        responsibilities,
        ...permissions,
      }),
      "Representative assigned.",
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
    });
  };

  const handleRemoveRepresentative = (profileId: number) => {
    if (!window.confirm("Remove this representative's institution access?")) return;
    void runSave(
      () => institutionAdminService.removeRepresentative(profileId),
      "Representative removed.",
    );
  };

  const tabClass = (tab: WorkspaceTab) =>
    `rounded-full px-4 py-2.5 font-['Inter',sans-serif] text-sm font-semibold transition ${
      activeTab === tab
        ? "bg-[#F49B31] text-white"
        : "border border-black/10 bg-white text-black/70 hover:bg-[#FEF5EA]"
    }`;

  const fieldClass =
    "mt-2 block w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-['Inter',sans-serif] text-sm outline-none focus:border-[#F49B31] focus:ring-2 focus:ring-[#FFC37B]";
  const submitClass =
    "rounded-full bg-[#F49B31] px-5 py-3 font-['Inter',sans-serif] text-sm font-semibold text-white transition hover:bg-[#E8911A] disabled:cursor-wait disabled:opacity-55";

  return (
    <AdminPageProvider initialPage="institution">
      <div className="min-h-screen w-full min-w-0 bg-[#FCFCFC]">
        <AdminLayout />
        <main className={`min-h-screen min-w-0 bg-[#FCFCFC] px-3 py-6 sm:px-6 sm:py-8 ${isSidebarCollapsed ? "md:ms-[80px]" : "md:ms-[230px]"} transition-all duration-300`}>
          <div className="mx-auto flex min-w-0 w-full max-w-6xl flex-col items-start gap-4 sm:gap-6">
            <header className="flex w-full flex-col items-start gap-1 sm:gap-2">
              <h1 className="hidden font-poppins text-[24px] font-bold leading-normal text-black md:block sm:text-[32px]">
                Institution
              </h1>
              <AdminHeader title="Institution" />
              <p className="font-poppins text-[13px] font-medium leading-normal text-[#8b8e8d] sm:text-[16px]">
                Manage your institution’s departments, Ping categories, context, and representatives.
              </p>
            </header>

          <div className="flex w-full min-w-0 flex-nowrap gap-2 overflow-x-auto pb-2 [&>button]:shrink-0 [&>button]:whitespace-nowrap" role="tablist" aria-label="Institution settings">
            {!isRepresentativeManager && (
              <>
                <button role="tab" aria-selected={activeTab === "departments"} onClick={() => setActiveTab("departments")} className={tabClass("departments")}>Academic units</button>
                <button role="tab" aria-selected={activeTab === "categories"} onClick={() => setActiveTab("categories")} className={tabClass("categories")}>Ping categories</button>
                <button role="tab" aria-selected={activeTab === "context"} onClick={() => setActiveTab("context")} className={tabClass("context")}>Ping context</button>
                <button role="tab" aria-selected={activeTab === "bodies"} onClick={() => setActiveTab("bodies")} className={tabClass("bodies")}>Bodies & committees</button>
              </>
            )}
            <button role="tab" aria-selected={activeTab === "representatives"} onClick={() => setActiveTab("representatives")} className={tabClass("representatives")}>Delegation & scope</button>
          </div>

          {error && <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-white p-4 font-['Inter',sans-serif] text-sm text-red-800">{error}</div>}
          {notice && <div role="status" className="mt-5 rounded-2xl border border-[#D1C0A9] bg-white p-4 font-['Inter',sans-serif] text-sm text-black/75">{notice}</div>}
          {loading ? (
            <div role="status" className="mt-6 rounded-2xl border border-black/10 bg-white p-6 font-['Inter',sans-serif] text-black/60">Loading institution settings…</div>
          ) : (
            <section className="mt-5 rounded-[20px] border border-black/10 bg-white p-5 shadow-sm sm:p-7">
              {activeTab === "departments" && (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
                  <div>
                    <h2 className="font-['Poppins',sans-serif] text-xl font-bold">Academic units</h2>
                    <p className="mt-1 font-['Inter',sans-serif] text-sm leading-6 text-black/60">Departments help students route issues to the right representatives.</p>
                    {departments.length ? (
                      <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[420px] border-collapse text-left font-['Inter',sans-serif] text-sm">
                          <thead><tr className="border-b border-black/10 text-black/55"><th className="py-3 pr-4 font-medium">Department</th><th className="py-3 pr-4 font-medium">Code</th><th className="py-3 text-right font-medium">Active pings</th></tr></thead>
                          <tbody>{departments.map((department) => <tr key={department.id} className="border-b border-black/5 last:border-0"><td className="py-3 pr-4 font-medium">{department.name}</td><td className="py-3 pr-4 text-black/65">{department.code}</td><td className="py-3 text-right text-black/65">{department._count?.pings ?? 0}</td></tr>)}</tbody>
                        </table>
                      </div>
                    ) : <p className="mt-5 rounded-xl bg-[#FEF5EA] p-4 font-['Inter',sans-serif] text-sm text-black/65">No departments have been added yet.</p>}
                  </div>
                  <form onSubmit={handleCreateDepartment} className="h-fit rounded-2xl bg-[#FEF5EA] p-5">
                    <h3 className="font-['Poppins',sans-serif] font-semibold">Add department</h3>
                    <label className="mt-4 block font-['Inter',sans-serif] text-sm font-medium">Department name<input required maxLength={160} value={departmentName} onChange={(event) => setDepartmentName(event.target.value)} className={fieldClass} /></label>
                    <label className="mt-4 block font-['Inter',sans-serif] text-sm font-medium">Short code<input required maxLength={32} value={departmentCode} onChange={(event) => setDepartmentCode(event.target.value)} placeholder="EIE" className={fieldClass} /></label>
                    <button type="submit" disabled={saving} className={`${submitClass} mt-5`}>{saving ? "Saving…" : "+ Add Department"}</button>
                  </form>
                </div>
              )}

              {activeTab === "categories" && (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
                  <div>
                    <h2 className="font-['Poppins',sans-serif] text-xl font-bold">Ping categories</h2>
                    <p className="mt-1 font-['Inter',sans-serif] text-sm leading-6 text-black/60">Categories organize community Pings and can be assigned to representative responsibilities.</p>
                    {categories.length ? (
                      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                        {categories.map((category) => (
                          <li key={category.id} className="rounded-xl border border-black/10 bg-[#FFFCF8] p-3 font-['Inter',sans-serif] text-sm font-medium text-[#454545]">
                            {editingCategoryId === category.id ? (
                              <form onSubmit={handleRenameCategory} className="flex min-w-0 flex-wrap gap-2">
                                <input aria-label={`Rename ${category.name}`} required maxLength={100} value={editingCategoryName} onChange={(event) => setEditingCategoryName(event.target.value)} className={`${fieldClass} mt-0 min-w-0 flex-1 px-3 py-2`} />
                                <button type="submit" disabled={saving} className="rounded-full bg-[#F49B31] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Save</button>
                                <button type="button" onClick={() => { setEditingCategoryId(null); setEditingCategoryName(""); }} className="rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-semibold">Cancel</button>
                              </form>
                            ) : (
                              <div className="flex min-w-0 items-center justify-between gap-2">
                                <span className="min-w-0 break-words">{category.name}</span>
                                <button type="button" onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); }} className="shrink-0 rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#75420B] hover:bg-[#FEF5EA]">Rename</button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-5 rounded-xl bg-[#FEF5EA] p-4 font-['Inter',sans-serif] text-sm text-black/65">No categories are available yet.</p>
                    )}
                  </div>
                  <form onSubmit={handleCreateCategory} className="h-fit rounded-2xl bg-[#FEF5EA] p-5">
                    <h3 className="font-['Poppins',sans-serif] font-semibold">Add a category</h3>
                    <label className="mt-4 block font-['Inter',sans-serif] text-sm font-medium">Category name<input required maxLength={100} value={categoryName} onChange={(event) => setCategoryName(event.target.value)} className={fieldClass} /></label>
                    <button type="submit" disabled={saving} className={`${submitClass} mt-5`}>{saving ? "Saving…" : "+ Add Category"}</button>
                  </form>
                </div>
              )}

              {activeTab === "context" && (
                <form onSubmit={handleSaveContextOptions}>
                  <h2 className="font-['Poppins',sans-serif] text-xl font-bold">Ping context choices</h2>
                  <p className="mt-1 max-w-[65ch] font-['Inter',sans-serif] text-sm leading-6 text-black/60">Manage the hall and level choices members can add to a Ping. Departments are managed under Academic units.</p>
                  <div className="mt-6 grid gap-8 lg:grid-cols-2">
                    <section className="rounded-2xl bg-[#FEF5EA] p-5">
                      <h3 className="font-['Poppins',sans-serif] font-semibold">Halls of residence</h3>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input aria-label="New hall of residence" maxLength={100} value={hallDraft} onChange={(event) => setHallDraft(event.target.value)} placeholder="e.g. North Hall" className={`${fieldClass} mt-0`} />
                        <button type="button" disabled={saving || !hallDraft.trim() || hallOptions.some((hall) => hall.toLowerCase() === hallDraft.trim().toLowerCase())} onClick={() => { setHallOptions((current) => [...current, hallDraft.trim()]); setHallDraft(""); }} className="shrink-0 rounded-full border border-[#A85C08] bg-white px-4 py-2 font-['Inter',sans-serif] text-sm font-semibold text-[#75420B] hover:bg-[#FFF9F1] disabled:opacity-50">Add hall</button>
                      </div>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {hallOptions.map((hall) => <li key={hall} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white py-1.5 pl-3 pr-1.5 font-['Inter',sans-serif] text-sm">{hall}<button type="button" aria-label={`Remove ${hall}`} onClick={() => setHallOptions((current) => current.filter((item) => item !== hall))} className="rounded-full px-2 py-0.5 text-[#75420B] hover:bg-[#FEF5EA]">×</button></li>)}
                        {!hallOptions.length && <li className="font-['Inter',sans-serif] text-sm text-black/55">No halls added.</li>}
                      </ul>
                    </section>
                    <section className="rounded-2xl bg-[#FEF5EA] p-5">
                      <h3 className="font-['Poppins',sans-serif] font-semibold">Academic levels</h3>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input aria-label="New academic level" inputMode="numeric" value={levelDraft} onChange={(event) => setLevelDraft(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="e.g. 700" className={`${fieldClass} mt-0`} />
                        <button type="button" disabled={saving || !levelDraft || Number(levelDraft) < 1 || levelOptions.includes(Number(levelDraft))} onClick={() => { setLevelOptions((current) => [...current, Number(levelDraft)].sort((a, b) => a - b)); setLevelDraft(""); }} className="shrink-0 rounded-full border border-[#A85C08] bg-white px-4 py-2 font-['Inter',sans-serif] text-sm font-semibold text-[#75420B] hover:bg-[#FFF9F1] disabled:opacity-50">Add level</button>
                      </div>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {levelOptions.map((level) => <li key={level} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white py-1.5 pl-3 pr-1.5 font-['Inter',sans-serif] text-sm">{level}L<button type="button" aria-label={`Remove ${level}L`} onClick={() => setLevelOptions((current) => current.filter((item) => item !== level))} className="rounded-full px-2 py-0.5 text-[#75420B] hover:bg-[#FEF5EA]">×</button></li>)}
                        {!levelOptions.length && <li className="font-['Inter',sans-serif] text-sm text-black/55">No levels added.</li>}
                      </ul>
                    </section>
                  </div>
                  <button type="submit" disabled={saving} className={`${submitClass} mt-6`}>{saving ? "Saving…" : "Save Ping Context"}</button>
                </form>
              )}

              {activeTab === "bodies" && (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
                  <div>
                    <h2 className="font-['Poppins',sans-serif] text-xl font-bold">Representative bodies & committees</h2>
                    <p className="mt-1 font-['Inter',sans-serif] text-sm leading-6 text-black/60">Create official groups, such as student associations, councils, or hall committees.</p>
                    {bodies.length ? (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {bodies.map((body) => (
                          <article key={body.id} className="rounded-2xl border border-black/10 bg-white p-4">
                            <h3 className="font-['Poppins',sans-serif] font-semibold">{body.name}</h3>
                            <p className="mt-1 font-['Inter',sans-serif] text-sm text-black/60">{body.department?.name ?? "Institution-wide"}</p>
                            {body.description && <p className="mt-2 font-['Inter',sans-serif] text-sm leading-6 text-black/70">{body.description}</p>}
                            <p className="mt-3 font-['Inter',sans-serif] text-xs text-black/50">{body._count?.representatives ?? 0} representatives · {body._count?.assignedPings ?? 0} assigned pings</p>
                          </article>
                        ))}
                      </div>
                    ) : <p className="mt-5 rounded-xl bg-[#FEF5EA] p-4 font-['Inter',sans-serif] text-sm text-black/65">No representative bodies have been created yet.</p>}
                  </div>
                  <form onSubmit={handleCreateBody} className="h-fit rounded-2xl bg-[#FEF5EA] p-5">
                    <h3 className="font-['Poppins',sans-serif] font-semibold">Create a body</h3>
                    <label className="mt-4 block font-['Inter',sans-serif] text-sm font-medium">Body name<input required maxLength={160} value={bodyName} onChange={(event) => setBodyName(event.target.value)} placeholder="AEIES" className={fieldClass} /></label>
                    <label className="mt-4 block font-['Inter',sans-serif] text-sm font-medium">Department (optional)<select value={bodyDepartmentId} onChange={(event) => setBodyDepartmentId(event.target.value)} className={fieldClass}><option value="">Institution-wide</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>
                    <label className="mt-4 block font-['Inter',sans-serif] text-sm font-medium">Description (optional)<textarea rows={3} maxLength={1000} value={bodyDescription} onChange={(event) => setBodyDescription(event.target.value)} className={fieldClass} /></label>
                    <button type="submit" disabled={saving} className={`${submitClass} mt-5`}>{saving ? "Saving…" : "+ Create Body"}</button>
                  </form>
                </div>
              )}

              {activeTab === "representatives" && (
                <div>
                  <h2 className="font-['Poppins',sans-serif] text-xl font-bold">Representative delegation & scope</h2>
                  <p className="mt-1 max-w-[65ch] font-['Inter',sans-serif] text-sm leading-6 text-black/60">Assign verified campus members to an official body and give each person only the permissions and categories they need.</p>

                  {representatives.length ? (
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full min-w-[680px] border-collapse text-left font-['Inter',sans-serif] text-sm">
                        <thead><tr className="border-b border-black/10 text-black/55"><th className="py-3 pr-4 font-medium">Representative</th><th className="py-3 pr-4 font-medium">Body</th><th className="py-3 pr-4 font-medium">Department</th><th className="py-3 pr-4 font-medium">Scope</th><th className="py-3 text-right font-medium">Action</th></tr></thead>
                        <tbody>{representatives.map((representative) => <tr key={representative.id} className="border-b border-black/5 last:border-0"><td className="py-3 pr-4"><span className="block font-medium">{representative.user.firstName} {representative.user.lastName}</span><span className="text-xs text-black/55">{representative.user.email}</span></td><td className="py-3 pr-4">{representative.body?.name ?? "—"}</td><td className="py-3 pr-4">{representative.department?.name ?? "All departments"}</td><td className="py-3 pr-4 text-xs text-black/65">{representative.responsibilities === "*" ? "All categories" : representative.responsibilities.split(",").join(", ")}</td><td className="py-3 text-right"><button type="button" onClick={() => handleRemoveRepresentative(representative.id)} disabled={saving} className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-black/70 hover:bg-[#FEF5EA] disabled:opacity-50">Remove</button></td></tr>)}</tbody>
                      </table>
                    </div>
                  ) : <p className="mt-5 rounded-xl bg-[#FEF5EA] p-4 font-['Inter',sans-serif] text-sm text-black/65">No representatives have been assigned yet.</p>}

                  <form onSubmit={handleCreateRepresentative} className="mt-8 rounded-2xl bg-[#FEF5EA] p-5">
                    <h3 className="font-['Poppins',sans-serif] font-semibold">Assign representative</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="block font-['Inter',sans-serif] text-sm font-medium">Institutional email<input required type="email" maxLength={200} value={repEmail} onChange={(event) => setRepEmail(event.target.value)} placeholder="student@institution.edu" className={fieldClass} /></label>
                      <label className="block font-['Inter',sans-serif] text-sm font-medium">Representative title<input maxLength={160} value={repTitle} onChange={(event) => setRepTitle(event.target.value)} placeholder="Academic Officer" className={fieldClass} /></label>
                      <label className="block font-['Inter',sans-serif] text-sm font-medium">Representative body<select required value={repBodyId} onChange={(event) => { setRepBodyId(event.target.value); const body = bodies.find((item) => String(item.id) === event.target.value); setRepDepartmentId(body?.department?.id ? String(body.department.id) : ""); }} className={fieldClass}><option value="">Select a body</option>{bodies.map((body) => <option key={body.id} value={body.id}>{body.name}</option>)}</select></label>
                      <label className="block font-['Inter',sans-serif] text-sm font-medium">Department scope<select value={repDepartmentId} onChange={(event) => setRepDepartmentId(event.target.value)} className={fieldClass}><option value="">Use body scope / all departments</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>
                      <label className="block font-['Inter',sans-serif] text-sm font-medium">Level scope (optional)<select value={repScopeLevel} onChange={(event) => setRepScopeLevel(event.target.value)} className={fieldClass}><option value="">Any level</option>{levelOptions.map((level) => <option key={level} value={level}>{level}L</option>)}</select></label>
                      <label className="block font-['Inter',sans-serif] text-sm font-medium">Hall scope (optional)<select value={repScopeHall} onChange={(event) => setRepScopeHall(event.target.value)} className={fieldClass}><option value="">Any hall</option>{hallOptions.map((hall) => <option key={hall} value={hall}>{hall}</option>)}</select></label>
                    </div>

                    <fieldset className="mt-5">
                      <legend className="font-['Inter',sans-serif] text-sm font-semibold">Category responsibilities</legend>
                      <label className="mt-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 font-['Inter',sans-serif] text-sm"><input type="checkbox" checked={allCategories} onChange={(event) => { setAllCategories(event.target.checked); if (event.target.checked) setSelectedCategoryIds([]); }} className="accent-[#F49B31]" />All categories</label>
                      {!allCategories && <div className="mt-3 flex flex-wrap gap-2">{categories.map((category) => <label key={category.id} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 font-['Inter',sans-serif] text-sm"><input type="checkbox" checked={selectedCategoryIds.includes(category.id)} onChange={(event) => setSelectedCategoryIds((selected) => event.target.checked ? [...selected, category.id] : selected.filter((id) => id !== category.id))} className="accent-[#F49B31]" />{category.name}</label>)}</div>}
                      <button type="button" onClick={() => setAllCategories(false)} className="mt-2 font-['Inter',sans-serif] text-xs text-[#A85C08] underline">Choose specific categories</button>
                    </fieldset>

                    <fieldset className="mt-5">
                      <legend className="font-['Inter',sans-serif] text-sm font-semibold">Permissions</legend>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {([
                          ["canAssign", "Can assign issues"],
                          ["canRespond", "Can publish official responses"],
                          ["canAcknowledge", "Can acknowledge issues"],
                          ["canResolve", "Can resolve issues"],
                          ["canExport", "Can export data"],
                          ["canManageReps", "Can manage representatives"],
                        ] as const).map(([key, label]) => <label key={key} className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5 font-['Inter',sans-serif] text-sm"><input type="checkbox" checked={permissions[key]} onChange={(event) => setPermissions((current) => ({ ...current, [key]: event.target.checked }))} className="accent-[#F49B31]" />{label}</label>)}
                      </div>
                    </fieldset>

                    <button type="submit" disabled={saving || bodies.length === 0} className={`${submitClass} mt-6`}>{saving ? "Assigning…" : "Assign Representative"}</button>
                    {bodies.length === 0 && <p className="mt-2 font-['Inter',sans-serif] text-sm text-black/60">Create a representative body before assigning a member.</p>}
                  </form>
                </div>
              )}
            </section>
          )}
          </div>
        </main>
      </div>
    </AdminPageProvider>
  );
};

export default InstitutionWorkspace;
