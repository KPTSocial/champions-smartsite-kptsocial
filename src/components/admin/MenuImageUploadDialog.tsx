import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, FileText, ImageIcon, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];
const ACCEPTED_EXTENSIONS = '.pdf,.jpg,.jpeg,.png,.webp';

interface MenuImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which menu this upload targets */
  target: 'monthly_specials' | 'main_menu';
  onUploadComplete?: () => void;
}

export default function MenuImageUploadDialog({
  open,
  onOpenChange,
  target,
  onUploadComplete,
}: MenuImageUploadDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const title = target === 'monthly_specials' ? 'Monthly Specials' : 'Main Menu';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!ACCEPTED_FILE_TYPES.includes(selected.type)) {
      toast({ title: 'Invalid file type', description: 'Use PDF, JPEG, PNG, or WebP.', variant: 'destructive' });
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 10MB.', variant: 'destructive' });
      return;
    }
    setFile(selected);
    setDone(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const ext = file.name.split('.').pop() || 'pdf';
      const prefix = target === 'monthly_specials' ? 'specials' : 'main-menu';
      const filename = `${prefix}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-pdfs')
        .upload(filename, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const settingsField = target === 'monthly_specials' ? 'monthly_specials_url' : 'main_menu_url';
      const { error: settingsError } = await supabase
        .from('site_settings')
        .update({ [settingsField]: filename, updated_at: new Date().toISOString() } as any)
        .eq('id', 1);

      if (settingsError) throw settingsError;

      setDone(true);
      toast({ title: 'Upload complete', description: `${title} image updated for customer download.` });
      onUploadComplete?.();
    } catch (err) {
      console.error(err);
      toast({ title: 'Upload failed', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setDone(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {title} Image</DialogTitle>
          <DialogDescription>
            Upload a PDF or image that customers will be able to download. No menu items are parsed — this is just the file they see.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <p className="font-medium">Upload successful!</p>
            <p className="text-sm text-muted-foreground">Customers will now see the updated menu.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                onChange={handleFileSelect}
                className="hidden"
                id="menu-image-upload"
              />
              <label htmlFor="menu-image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="font-medium text-sm">Click to select file</p>
                  <p className="text-xs text-muted-foreground">PDF, JPEG, PNG, WebP • Max 10MB</p>
                </div>
              </label>
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                {file.type === 'application/pdf' ? (
                  <FileText className="h-5 w-5 text-red-500" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                )}
                <span className="text-sm truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {done ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Upload
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
