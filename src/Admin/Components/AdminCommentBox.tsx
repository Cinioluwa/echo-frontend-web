import { FaCheckCircle } from "react-icons/fa";
import profileImage from "../../assets/images/profileImage.jpeg";

export default function AdminCommentBox() {
  return (
    <div className="w-[300px] bg-[#f1dabe] rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <img
            src={profileImage}
            alt="admin"
            className="w-9 h-9 rounded-full object-cover"
          />

          <FaCheckCircle className="absolute -bottom-1 -left-1 text-amber-700 bg-white rounded-full text-sm" />
        </div>

        <p className="font-semibold text-gray-600">Osagunwenro Ugbo</p>
      </div>

      {/* Comment Box */}
      <textarea
        placeholder="Give an official comment..."
        className="
          w-full
          h-[300px]
          bg-gray-100
          rounded-xl
          p-4
          text-sm
          outline-none
          resize-none
          placeholder:text-gray-400
        "
      />

      {/* Actions */}
      <div className="flex justify-center items-center gap-6 mt-5">
        <button
          className="
            bg-amber-500
            hover:bg-amber-600
            text-white
            font-medium
            px-6
            py-2
            rounded-lg
            transition
          "
        >
          Send
        </button>

        <button
          className="
            text-gray-500
            hover:text-gray-700
            font-medium
          "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
