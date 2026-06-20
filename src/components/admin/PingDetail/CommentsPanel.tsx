import React from "react";
import type { PingComment } from "./types";
import { ArrowRight, MessageCircle } from "lucide-react";

interface CommentsPanelProps {
    comments: PingComment[];
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ comments }) => {
    return (
        <div className="bg-[#F49B31] rounded-xl flex flex-col gap-2 sm:gap-3">
            <h3 className="font-poppins pt-3 px-3 sm:pt-4 px-4 font-semibold text-[16px] sm:text-[18px] text-white rounded-t-xl">
                Comments
            </h3>
            <div className="flex flex-col gap-2 px-3 sm:px-4 sm:gap-3 max-h-[250px] sm:max-h-[300px] overflow-y-auto bg-[#ffc37b] py-2">
                {comments.slice(0, 2).map((comment) => (
                    <div
                        key={comment.id}
                        className="bg-white rounded-lg p-2 sm:p-3 flex gap-2 sm:gap-3"
                    >
                        <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 flex flex-col gap-1">
                            <p className="font-poppins font-semibold text-[11px] sm:text-[13px] text-black">
                                {comment.author}
                            </p>
                            <p className="font-poppins font-medium text-[10px] sm:text-[12px] text-[#626665] line-clamp-2">
                                {comment.text}
                            </p>
                            <div className="flex gap-2 text-[9px] sm:text-[10px] text-black">
                                <span className="flex items-center gap-2"><img src="/assets/images/surge.svg" alt="" className="w-5 h-5" /> {comment.likes}</span>
                                <span className="flex items-center gap-2"><MessageCircle color="black" size={20} /> {comment.replies}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {
                comments.length >= 3 ? (
                    <button className="bg-white border border-white text-black font-poppins font-semibold text-[11px] sm:text-[13px] py-2.5 px-4 rounded-full hover:bg-[#fef5ea] transition-colors w-10/12 mx-3 mb-3 sm:mx-4 sm:mb-4  flex justify-center items-center gap-2 text-nowrap mx-auto self-center">
                        View all {comments.length} Comments <ArrowRight color="black" size={20} />
                    </button>
                ) : (
                    <div className="text-black font-poppins font-semibold text-[11px] sm:text-[13px] py-2.5 px-4 rounded-full transition-colors w-10/12 mx-3 mb-3 sm:mx-4 sm:mb-4  flex justify-center items-center gap-2 text-nowrap mx-auto self-center">
                    </div>
                )
            }
        </div>
    );
};

export default CommentsPanel;
