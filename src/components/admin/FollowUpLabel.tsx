interface FollowUpLabelProps {
  label: string;
  borderColor: string;
  backgroundColor: string;
  color: string;
}

const FollowUpLabel = ({
  label,
  color,
  borderColor,
  backgroundColor,
}: FollowUpLabelProps) => {
  return (
    <>
      <div
        className={`border shadow-md text-[12px] px-2 py-0.5 rounded-4xl`}
        style={{
          borderColor: borderColor,
          color: color,
          backgroundColor: backgroundColor,
        }}
      >
        {label}
      </div>
    </>
  );
};

export default FollowUpLabel;
