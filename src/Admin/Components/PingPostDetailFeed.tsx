import { useState } from "react";
import type { PingFormDetails } from "../../components/PingFormModal";
import AdminComment from "./AdminComment";
import AdminCommentBox from "./AdminCommentBox";
import AdminPingCard from "./AdminPingCard";
import { FaCommentDots } from "react-icons/fa6";

interface AdminPingCardProps {
  pings: PingFormDetails;
}

const comments = [
  {
    id: "cmt_1",
    author: "Osagunwenro",
    content:
      "I completely agree with the point raised in this article. Too often we see people focusing only on the immediate benefits of a decision without considering the long-term impact it may have on a project or a team. In my experience working with distributed teams, having a clear process and well-documented expectations can make a huge difference in how smoothly things run.",
    timeAgo: "6 days ago",
    repliesCount: 2,
    createdAt: "2026-03-02T10:14:00Z",
  },
  {
    id: "cmt_2",
    author: "Amaka Okoye",
    content:
      "This was a really insightful read. I especially liked the part where you discussed how small process improvements can compound over time. In our company we introduced a simple weekly review system, and within a few months it significantly improved accountability and communication across departments.",
    timeAgo: "5 days ago",
    repliesCount: 1,
    createdAt: "2026-03-03T08:42:00Z",
  },
  {
    id: "cmt_3",
    author: "Daniel Mensah",
    content:
      "One thing I would add is that adopting new workflows can sometimes create resistance among team members, especially if they feel those changes are imposed without proper explanation. Taking the time to explain the reasoning behind decisions and allowing space for feedback can help teams feel more involved in the process.",
    timeAgo: "4 days ago",
    repliesCount: 3,
    createdAt: "2026-03-04T14:21:00Z",
  },
  {
    id: "cmt_4",
    author: "Sarah Johnson",
    content:
      "I've seen this play out in several startups I've worked with. Early on, everything feels informal and flexible, which is great for speed, but as the team grows it becomes harder to maintain clarity without introducing some structure. The key is finding the balance between maintaining agility and creating systems that support long-term scalability.",
    timeAgo: "3 days ago",
    repliesCount: 0,
    createdAt: "2026-03-05T16:10:00Z",
  },
  {
    id: "cmt_5",
    author: "Tunde Adebayo",
    content:
      "Thank you for sharing this perspective. I think the most important takeaway here is that thoughtful planning does not necessarily slow a team down — in many cases it actually accelerates progress because fewer mistakes are made along the way. It would be interesting to see some real-world case studies included in a follow-up article.",
    timeAgo: "2 days ago",
    repliesCount: 4,
    createdAt: "2026-03-06T11:05:00Z",
  },
];

const PingPostDetailFeed = ({ pings }: AdminPingCardProps) => {
  const [openComment, setOpenComment] = useState(true);

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
          {comments.map((comment) => (
            <AdminComment
              key={comment.id}
              author={comment.author}
              content={comment.content}
              timeAgo={comment.timeAgo}
              repliesCount={comment.repliesCount}
            />
          ))}
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
