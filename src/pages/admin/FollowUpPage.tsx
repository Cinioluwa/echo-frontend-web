import AdminLayout from "../../components/admin/AdminLayout";
import { FollowUp } from "../../components/admin/FollowUp";

/**
 * FollowUpPage
 * Page wrapper for the Follow Up admin page with sidebar layout
 */
const FollowUpPage: React.FC = () => {

    return (
        <div className="h-full">
            <AdminLayout />
            <FollowUp />
        </div>
    );
};

export default FollowUpPage;
