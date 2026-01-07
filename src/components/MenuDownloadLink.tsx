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
  const handleDownload = async () => {
    try {
      const fileUrl = isLocalFile 
        ? `/menus/${encodeURIComponent(fileName)}`
        : `https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/menu-pdfs/${encodeURIComponent(fileName)}`;
      
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to download file");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your menu is downloading...",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Could not download the menu. Please try again.",
        variant: "destructive",
      });
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
