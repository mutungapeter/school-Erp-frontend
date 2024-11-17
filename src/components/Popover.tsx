import { useState, useRef, useEffect } from "react";
import { PiGearLight } from "react-icons/pi";
import EditTerm from "./terms/EditTerm";
import DeleteTerm from "./terms/DeleteTerm";
import ClickOutside from "./ClickOutside";

const CustomPopover = ({
  termId,
  refetchTerms,
}: {
  termId: number;
  refetchTerms: () => void;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<"top" | "bottom">("bottom");
  
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const togglePopover = () => setIsPopoverOpen(!isPopoverOpen);

  const handlePopoverClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };


  useEffect(() => {
    if (triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverHeight = popoverRef.current.offsetHeight;

      if (window.innerHeight - triggerRect.bottom >= popoverHeight) {
        setPopoverPosition("bottom");
      } else if (triggerRect.top >= popoverHeight) {
        setPopoverPosition("top");
      } else {
        setPopoverPosition("top"); 
      }
    }
  }, [isPopoverOpen]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={togglePopover}
        className="flex items-center space-x-1 bg-gray-100 p-2 rounded hover:bg-gray-200"
      >
        <PiGearLight size={16} className="text-gray-600" />
        <span className="text-sm text-gray-600">Actions</span>
      </button>

      {/* Popover */}
      {isPopoverOpen && (
        <ClickOutside
          onClick={() => setIsPopoverOpen(false)}
        
        >
          <div
            ref={popoverRef}
            className={`absolute right-0 w-48 bg-white border rounded shadow-md p-2 `}
            onClick={handlePopoverClick} 
          >
            <div className="space-y-2 ">
              <EditTerm termId={termId} refetchTerms={refetchTerms} />
              <DeleteTerm termId={termId} refetchTerms={refetchTerms} />
              <button
                className="w-full text-left px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                onClick={() => {
                  // Handle Update Status Logic
                  console.log("Update status for termId:", termId);
                }}
              >
                Update Status
              </button>
            </div>
          </div>
      </ClickOutside>
      )}
    </div>
  );
};

export default CustomPopover;
