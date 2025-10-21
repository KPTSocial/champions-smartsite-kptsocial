import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export const MenuPdfDownloadButton = () => {
  const handleDownload = async () => {
    try {
      const pdfUrl = "https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/menu-pdfs/champions-menu-fall-2025.pdf";
      
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to download PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "champions-menu-fall-2025.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your menu PDF is downloading...",
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
    <Button
      onClick={handleDownload}
      size="lg"
      className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 h-14 w-14 md:h-16 md:w-16 z-50"
      aria-label="Download menu PDF"
    >
      <Download className="h-6 w-6 md:h-7 md:w-7" />
    </Button>
  );
};
