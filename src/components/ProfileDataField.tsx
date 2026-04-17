

const ProfileDataField = ({ label, value, note }: { label: string; value: string; note: string }) => {
  return (
<div className="space-y-1 md:space-y-2">
    <label className="text-xs md:text-sm text-[#4A3728]">{label}</label>
    <div className="w-full p-3 md:p-4 bg-[#FFFBF5] border border-orange-100 rounded-xl text-gray-700 font-medium text-sm">
      {value}
    </div>
    <p className="text-[10px] md:text-[11px] text-gray-400 italic">{note}</p>
  </div>
  )
}

export default ProfileDataField