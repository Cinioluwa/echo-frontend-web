interface AdminCommentProps {
  author: string;
  content: string;
  timeAgo: string;
  repliesCount?: number;
}

const AdminComment = ({
  author,
  content,
  timeAgo,
  repliesCount = 2,
}: AdminCommentProps) => {
  return (
    <div className="py-6 border-b border-gray-200 ">
      {/* Header */}
      <div className="flex items-center text-sm mb-2">
        <span className="font-semibold text-gray-900">{author}</span>
        <span className="mx-2 text-gray-400">•</span>
        <span className="text-gray-500">{timeAgo}</span>
      </div>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed mb-3">{content}</p>

      {/* Replies */}
      {repliesCount > 0 && (
        <button className="text-sm text-gray-500 hover:text-gray-700">
          {repliesCount} {repliesCount === 1 ? "reply" : "replies"}
        </button>
      )}
    </div>
  );
};

export default AdminComment;
