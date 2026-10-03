import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import institutionAdminService from "../api/services/institutionAdmin.service";
import { useAuthStore } from "../stores";

export interface OptionalPingContextValue {
  targetDepartmentId: number | null;
  targetLevel: number | null;
  targetHall: string;
}

interface OptionalPingContextProps {
  value: OptionalPingContextValue;
  onChange: (value: OptionalPingContextValue) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const ContextDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) => {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <span className="block font-['Inter',sans-serif] text-xs font-medium text-[#454545]">
        {label}
      </span>
      <button
        id={`${id}-trigger`}
        type="button"
        role="combobox"
        aria-label={`${label} for this Ping`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        onClick={() => setIsOpen((open) => !open)}
        className="mt-1 flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl border-2 border-[#FFC37B] bg-white px-3 py-2.5 text-left font-['Inter',sans-serif] text-sm text-[#454545] transition hover:border-[#F49B31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F49B31]"
      >
        <span className="truncate">{selectedOption?.label ?? options[0]?.label}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-[#F49B31] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div
          id={`${id}-options`}
          role="listbox"
          aria-labelledby={`${id}-trigger`}
          className="absolute inset-x-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-xl border-2 border-[#F49B31] bg-white py-1 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left font-['Inter',sans-serif] text-sm transition hover:bg-[#FEF5EA] ${
                option.value === value
                  ? "bg-[#FEF5EA] font-semibold text-[#75420B]"
                  : "text-[#454545]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const OptionalPingContext = ({ value, onChange }: OptionalPingContextProps) => {
  const organizationId = useAuthStore((state) => state.user?.organizationId);
  const [departments, setDepartments] = useState<
    Array<{ id: number; name: string; code: string }>
  >([]);
  const [halls, setHalls] = useState<string[]>([]);
  const [levels, setLevels] = useState<number[]>([]);
  const [contextError, setContextError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!organizationId) {
      setDepartments([]);
      setHalls([]);
      setLevels([]);
      return;
    }

    institutionAdminService
      .getContextOptions(organizationId)
      .then((options) => {
        if (cancelled) return;
        setDepartments(options.departments);
        setHalls(options.halls);
        setLevels(options.levels);
        setContextError(null);
      })
      .catch((error: unknown) => {
        console.error("Failed to load optional ping context:", error);
        if (!cancelled) {
          setContextError(
            "Optional department and level tags are unavailable right now.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  const departmentOptions = [
    { value: "", label: "Any department" },
    ...departments.map((department) => ({
      value: String(department.id),
      label: department.name,
    })),
  ];
  const levelOptions = [
    { value: "", label: "Any level" },
    ...levels.map((level) => ({ value: String(level), label: `${level}L` })),
  ];
  const hallOptions = [
    { value: "", label: "Any hall" },
    ...halls.map((hall) => ({ value: hall, label: hall })),
  ];

  return (
    <section
      aria-label="Optional context"
      className="w-full rounded-2xl border border-[#E8D6BF] bg-[#FFFCF8] p-3 md:p-4"
    >
      <div className="mb-3">
        <h3 className="font-['Poppins',sans-serif] text-sm font-semibold text-[#454545]">
          Optional context
        </h3>
        <p className="mt-0.5 font-['Inter',sans-serif] text-xs leading-5 text-black/60">
          Help route this Ping. These details apply only to this post.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,_180px),_1fr))] gap-3">
        <ContextDropdown
          label="Department"
          value={value.targetDepartmentId?.toString() ?? ""}
          options={departmentOptions}
          onChange={(departmentId) =>
            onChange({
              ...value,
              targetDepartmentId: departmentId ? Number(departmentId) : null,
            })
          }
        />
        <ContextDropdown
          label="Level"
          value={value.targetLevel?.toString() ?? ""}
          options={levelOptions}
          onChange={(level) =>
            onChange({
              ...value,
              targetLevel: level ? Number(level) : null,
            })
          }
        />
        <ContextDropdown
          label="Hall of residence"
          value={value.targetHall}
          options={hallOptions}
          onChange={(targetHall) => onChange({ ...value, targetHall })}
        />
      </div>
      {contextError && (
        <p
          role="status"
          className="mt-3 font-['Inter',sans-serif] text-xs text-[#8A510E]"
        >
          {contextError}
        </p>
      )}
    </section>
  );
};

export default OptionalPingContext;
