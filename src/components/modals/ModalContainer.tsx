import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function ModalContainer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-md" 
}: ModalContainerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className={`bg-background rounded-lg w-full ${maxWidth} max-h-[90vh] overflow-auto shadow-strong animate-in fade-in-0 zoom-in-95 duration-200`}>
        {title && (
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className={title ? "p-6 pt-4" : "p-6"}>
          {children}
        </div>
      </div>
    </div>
  );
}