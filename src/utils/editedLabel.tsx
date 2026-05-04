/**
 * EditedLabel Component
 * Displays a small "(edited)" indicator next to timestamps for posts
 * that have been modified within their 5-minute edit window.
 */
export const EditedLabel = () => (
  <span 
    className="text-[10px] text-[#999] italic ml-1 select-none" 
    aria-label="This post was edited after posting"
  >
    (edited)
  </span>
);
