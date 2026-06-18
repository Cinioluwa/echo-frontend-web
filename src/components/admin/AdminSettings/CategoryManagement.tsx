import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../../api/services/admin.service";
import categoryService from "../../../api/services/category.service";

interface CategoryItem {
  id: number;
  name: string;
  isActive: boolean;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data.map((c) => ({ id: c.id, name: c.name, isActive: true })));
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleStatus = async (id: number) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    try {
      setError(null);
      const updated = await adminService.updateCategory(id, { isActive: !cat.isActive });
      setCategories(categories.map((c) => (c.id === id ? { ...c, isActive: updated.isActive } : c)));
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update status");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      setError(null);
      const created = await adminService.createCategory(newCategoryName.trim());
      setCategories([...categories, { id: created.id, name: created.name, isActive: true }]);
      setNewCategoryName("");
      setIsAdding(false);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create category");
    }
  };

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim() || editingId === null) return;
    try {
      setError(null);
      const updated = await adminService.updateCategory(editingId, { name: editingName.trim() });
      setCategories(categories.map((c) => (c.id === editingId ? { ...c, name: updated.name } : c)));
      setEditingId(null);
      setEditingName("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Delete this category permanently? This cannot be undone.")) return;
    try {
      setError(null);
      await adminService.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to delete category");
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedCategories = [...categories];
    const [draggedItem] = updatedCategories.splice(draggedIndex, 1);
    updatedCategories.splice(index, 0, draggedItem);
    setCategories(updatedCategories);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="pb-4 flex flex-col gap-1 md:flex-row md:items-center">
        <div>
          <h2 className="font-poppins font-semibold text-[18px] text-[#212121]">
            Category Management
          </h2>
          <p className="font-poppins text-[12px] text-black mt-1">
            Controls the categories that students can post Pings into
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px] font-poppins">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-black text-[13px] font-medium">
          Drag and drop sortable list of active categories
        </span>
        <button
          onClick={() => setIsAdding(true)}
          className="mt-3 md:mt-0 px-4 py-2 bg-[#f49b31] text-white rounded-[10px] hover:bg-[#d88429] font-poppins font-semibold text-[13px] flex items-center gap-1.5 self-start transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New Category
        </button>
      </div>

      {isAdding && (
        <div className="p-4 bg-white border border-[#f49b31] rounded-[15px] flex flex-col sm:flex-row gap-3 items-end sm:items-center">
          <div className="flex flex-col gap-1 flex-1 w-full">
            <label className="font-poppins text-[12px] font-medium text-[#5e5c58]">
              Category Name
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="px-4 py-2 border border-[#ffd7a8] rounded-[10px] outline-none text-[14px] font-poppins focus:border-[#f49b31]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-[#f49b31] text-white font-poppins font-semibold text-[13px] rounded-[10px] hover:bg-[#d88429]"
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-[#e5e5e5] text-[#5e5c58] font-poppins font-semibold text-[13px] rounded-[10px] hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-[#f49b31] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-[#fefaf4] border border-[#ffd7a8] rounded-[5px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFC37B] border-b border-[#ffd7a8] text-black">
                  <th className="p-4 font-poppins font-semibold text-[14px] w-2/5">
                    Categories
                  </th>
                  <th className="p-4 font-poppins font-semibold text-[14px] w-1/5">
                    Status
                  </th>
                  <th className="p-4 font-poppins font-semibold text-[14px] w-2/5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr
                    key={cat.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`border-b border-[#ffd7a8]/30 last:border-0 hover:bg-[#fff9f1] transition-colors cursor-grab select-none ${
                      draggedIndex === index ? "opacity-40 bg-gray-100" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-[#f49b31] opacity-70 hover:opacity-100 shrink-0">
                          <img src="/assets/icon/grip.svg" alt="grip handle" className="w-4 h-4 pointer-events-none" />
                        </div>

                        {editingId === cat.id ? (
                          <div className="flex items-center gap-2" onDragStart={(e) => e.preventDefault()} draggable={false}>
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="px-3 py-1 border border-[#f49b31] rounded-[8px] outline-none text-[14px] font-poppins bg-white"
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 bg-[#f49b31] text-white rounded-[6px]"
                            >
                              ✔
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 bg-gray-300 text-black rounded-[6px]"
                            >
                              ✖
                            </button>
                          </div>
                        ) : (
                          <span className="font-poppins font-medium text-[15px] text-[#212121]">
                            {cat.name}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4" onDragStart={(e) => e.preventDefault()} draggable={false}>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleStatus(cat.id)}
                          className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                            cat.isActive ? "bg-[#f49b31]" : "bg-[#e5e5e5]"
                          }`}
                          aria-label="Toggle status"
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                              cat.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>

                        <span
                          className={`px-2.5 py-[5px] rounded-[12px] font-poppins font-medium text-[11px] ${
                            cat.isActive
                              ? "bg-[#8ECF24] text-[#FEF5EA]"
                              : "bg-[#B01212] text-[#FEF5EA]"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4" onDragStart={(e) => e.preventDefault()} draggable={false}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#ffd7a8] rounded-[10px] text-[#f49b31] font-poppins font-medium text-[13px] hover:bg-[#fef5ea] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-[10px] text-red-600 font-poppins font-medium text-[13px] hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
