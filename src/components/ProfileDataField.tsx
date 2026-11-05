

const ProfileDataField = ({ label, value, note }: { label: string; value: string; note: string }) => {
  return (
<div className="space-y-1 md:space-y-2">
    <label className="text-xs md:text-sm font-medium text-[var(--echo-text-4a3728)]">{label}</label>
    <div className="w-full p-3 md:p-4 bg-[var(--echo-surface-soft)] border border-[var(--echo-border-f4e3c9)] rounded-xl text-[var(--echo-text-primary)] font-medium text-sm">
      {value}
    </div>
    <p className="text-[10px] md:text-[11px] text-[var(--echo-text-6b6259)]">{note}</p>
  </div>
  )
}

export default ProfileDataField