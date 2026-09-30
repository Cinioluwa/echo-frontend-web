

const ProfileDataField = ({ label, value, note }: { label: string; value: string; note: string }) => {
  return (
<div className="space-y-1 md:space-y-2">
    <label className="text-xs md:text-sm font-medium text-[#4A3728]">{label}</label>
    <div className="w-full p-3 md:p-4 bg-[#FEF5EA] border border-[#F4E3C9] rounded-xl text-[#060B13] font-medium text-sm">
      {value}
    </div>
    <p className="text-[10px] md:text-[11px] text-[#6B6259]">{note}</p>
  </div>
  )
}

export default ProfileDataField