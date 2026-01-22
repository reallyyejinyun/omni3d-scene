import { memo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

/**
 * 可折叠的section组件
 * @param param0 
 * @returns 
 */
export const CollapsibleSection: React.FC<{
    title: string;
    icon?: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode
}> = memo(({ title, icon, isOpen, onToggle, children }) => (
    <div className="space-y-3">
        <button
            onClick={onToggle}
            className="flex items-center justify-between w-full group"
        >
            <div className="flex items-center gap-2 px-1">
                {icon || <ChevronRight size={14} className={`text-blue-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />}
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">{title}</h3>
            </div>
            {icon && (isOpen ? <ChevronDown size={14} className="text-gray-600" /> : <ChevronRight size={14} className="text-gray-600" />)}
        </button>
        {isOpen && (
            <div className="animate-in slide-in-from-top-1 duration-200">
                {children}
            </div>
        )}
    </div>
));