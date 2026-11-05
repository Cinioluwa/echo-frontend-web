interface Props {
    title: string;
    description: string;
}

const PingContent = ({ title, description }: Props) => {
    return (
        <div className="flex flex-col gap-2.5">
            {/* Ping title */}
            <h2 className="text-xl font-bold text-[#292936] leading-7 tracking-tight">
                {title}
            </h2>

            {/* Ping description */}
            <p className="text-base text-[#63637B] leading-6 whitespace-pre-wrap">
                {description}
            </p>
        </div>
    );
};

export default PingContent;
