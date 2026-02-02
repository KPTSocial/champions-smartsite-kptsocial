import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface MenuPdfDownloadButtonProps {
  fileName: string;
  downloadName: string;
  label?: string;
  isLocalFile?: boolean;
}

export const MenuPdfDownloadButton = ({ 
  fileName, 
  downloadName, 
  label = "Download menu PDF",
  isLocalFile = false
}: MenuPdfDownloadButtonProps) => {
  const handleDownload = () => {
    const fileUrl = isLocalFile 
      ? `${window.location.origin}/menus/${encodeURIComponent(fileName)}`
      : `https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/menu-pdfs/${encodeURIComponent(fileName)}`;
    
    // Always open in new tab for consistent cross-device experience
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
    toast({
      title: "Opening menu",
      description: "Your menu is opening in a new tab.",
    });
  };

  return (
    <Button
      onClick={handleDownload}
      size="lg"
      className="absolute bottom-4 right-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 h-14 w-14 md:h-16 md:w-16 z-10"
      aria-label={label}
    >
      <Download className="h-6 w-6 md:h-7 md:w-7" />
    </Button>
  );
};
