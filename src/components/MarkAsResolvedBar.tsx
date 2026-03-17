/**
 * MarkAsResolvedBar
 * Figma ref: 4183:14873
 * Phase: 3
 *
 * Shown at the bottom of a Ping Detail when waves exist.
 * Only visible to the ping author or an admin.
 */

interface Props {
    pingId: string;
    onResolved?: () => Promise<void> | void;
}

const MarkAsResolvedBar = ({ pingId: _pingId, onResolved }: Props) => {
    const handleResolve = async () => {
        try {
            await onResolved?.();
        } catch (err) {
            console.error("Failed to mark ping as resolved:", err);
        }
    };

    return (
        <div className=" rounded-[15px] p-[5px] flex flex-col items-center gap-2.5 justify-center">
            {/* Text */}
            <p className="flex-1 text-[16px] text-black text-center">
                Has this problem been solved?
            </p>

            {/* Mark as Resolved button */}
            <button
                type="button"
                onClick={handleResolve}
                className="w-full bg-[#f49b31] px-5 py-2.5 rounded-[15px] cursor-pointer hover:bg-[#ffac47] transition-colors duration-300"
            >
                <span className="font-['Poppins:Medium',sans-serif] text-[#fffefe] text-[14px] text-center whitespace-nowrap">
                    Mark as Resolved
                </span>
            </button>
        </div>
    );
};

export default MarkAsResolvedBar;
