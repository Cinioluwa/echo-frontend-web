import React from "react";
import { Moderation } from "../../components/admin/Moderation";

/**
 * ModerationPage
 * Page wrapper for the Moderation admin page
 */
const ModerationPage: React.FC = () => {
    return (
        <div className="w-full">
            <Moderation />
        </div>
    );
};

export default ModerationPage;
