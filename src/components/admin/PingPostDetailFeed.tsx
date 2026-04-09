import { useState } from "react";
import type { AdminPing } from "../../api/types/admin.types";
import type { Comment } from "../../api/types";
import AdminComment from "./AdminComment";
import AdminCommentBox from "./AdminCommentBox";
import AdminPingCard from "./AdminPingCard";
import { FaCommentDots } from "react-icons/fa6";

interface AdminPingCardProps {
  pings: AdminPing;
}

const PingPostDetailFeed = ({ pings }: AdminPingCardProps) => {
  const [openComment, setOpenComment] = useState(true);
  const comments: Comment[] = (pings.comments || []) as Comment[];

  return (
    <div>
      <AdminPingCard pings={pings} />

      <div className="bg-white rounded-lg my-5 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm text-gray-500">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>

          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Comments */}
        <div>
          {comments.map((comment) => {
            const getAuthorName = (author: any) => {
              if (typeof author === "string") return author;
              if (author?.firstName && author?.lastName) {
                return `${author.firstName} ${author.lastName}`;
              }
              return author?.email || "Anonymous";
            };

            const getTimeAgo = (createdAt: string) => {
              const date = new Date(createdAt);
              const now = new Date();
              const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
              const minutes = Math.floor(seconds / 60);
              const hours = Math.floor(minutes / 60);
              const days = Math.floor(hours / 24);

              if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
              if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
              if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
              return "just now";
            };

            return (
              <AdminComment
                key={comment.id}
                author={getAuthorName(comment.author)}
                content={comment.content}
                timeAgo={getTimeAgo(comment.createdAt)}
                repliesCount={comment.replyCount || 0}
              />
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-23 left-6">
        <div className="hidden md:block">
          <AdminCommentBox />
        </div>
        <div className="md:hidden">
          {openComment && <AdminCommentBox />}

          <span
            onClick={() => setOpenComment(!openComment)}
            className="w-10 mt-4 inline-flex justify-center items-center md:hidden bg-[#F49B31] h-10 rounded-full"
          >
            <FaCommentDots color="white" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PingPostDetailFeed;
