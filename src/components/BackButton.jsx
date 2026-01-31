import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to, label = "Back" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-[#FF6347] hover:text-[#FF6347] transition-all duration-200 shadow-sm"
        >
            <ArrowLeft size={18} weight="bold" />
            {label}
        </button>
    );
};

export default BackButton;
