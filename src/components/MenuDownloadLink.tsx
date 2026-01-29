import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MenuDownloadLinkProps {
  fileName: string;
  downloadName: string;
  displayText: string;
  isLocalFile?: boolean;
}

export const MenuDownloadLink = ({ 
  fileName, 
  downloadName, 
  displayText,
  isLocalFile = false
}: MenuDownloadLinkProps) => {
  const handleDownload = () => {
    const fileUrl = isLocalFile 
      ? `${window.location.origin}/menus/${encodeURIComponent(fileName)}`
      : `https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/menu-pdfs/${encodeURIComponent(fileName)}`;
    
    // Open in new tab - works on all devices including iOS
    const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');
    
    if (newWindow) {
      toast({
        title: "Opening menu",
        description: "Your menu is opening in a new tab.",
      });
    } else {
      // Fallback if popup blocked
      toast({
        title: "Opening menu",
        description: "If the menu doesn't open, please allow popups for this site.",
      });
      window.location.href = fileUrl;
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="text-muted-foreground hover:text-primary cursor-pointer inline-flex items-center gap-2 underline underline-offset-4 transition-colors duration-200 mt-2"
      aria-label={displayText}
    >
      <Download className="h-4 w-4" />
      {displayText}
    </button>
  );
};
