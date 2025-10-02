import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CalendarIcon, Loader2, FileText, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

interface ParsedMenuItem {
  name: string;
  description: string;
  price: number;
  tags: string[];
  confidence: number;
}

interface MenuCategory {
  id: string;
  name: string;
  section: {
    name: string;
  };
}

interface PdfMenuUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: MenuCategory[];
  onImportComplete: () => void;
  defaultCategoryId?: string;
  allowSpecialScheduling?: boolean;
}

export default function PdfMenuUploadDialog({ 
  open, 
  onOpenChange, 
  categories,
  onImportComplete,
  defaultCategoryId,
  allowSpecialScheduling = true
}: PdfMenuUploadDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'upload' | 'category' | 'options' | 'review'>('upload');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategoryId || '');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [clearExisting, setClearExisting] = useState(false);
  const [markFeatured, setMarkFeatured] = useState(false);
  const [markAsSpecial, setMarkAsSpecial] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [parsedItems, setParsedItems] = useState<ParsedMenuItem[]>([]);
  const [editedItems, setEditedItems] = useState<ParsedMenuItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "PDF must be under 10MB",
          variant: "destructive"
        });
        return;
      }
      setPdfFile(file);
    }
  };

  const setNextMonthDates = () => {
    const nextMonth = addMonths(new Date(), 1);
    setStartDate(startOfMonth(nextMonth));
    setEndDate(endOfMonth(nextMonth));
  };

  const activateImmediately = () => {
    setStartDate(new Date());
    setEndDate(endOfMonth(new Date()));
  };

  const handleProcessPdf = async () => {
    if (!pdfFile) {
      toast({
        title: "Missing file",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setUploadProgress('Uploading PDF file...');

    try {
      // Upload PDF to storage
      const fileName = `monthly-special-${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('menu-pdfs')
        .upload(fileName, pdfFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-pdfs')
        .getPublicUrl(fileName);

      setPdfUrl(publicUrl);
      setUploadProgress('Parsing menu items...');

      // Call edge function to parse PDF
      const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-menu-pdf', {
        body: { pdf_url: publicUrl }
      });

      if (parseError) throw parseError;

      if (!parseData.items || parseData.items.length === 0) {
        toast({
          title: "No items found",
          description: "Could not extract menu items from PDF. Please check the file format.",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }

      setParsedItems(parseData.items);
      setEditedItems(parseData.items);
      setStep('review');
      
      toast({
        title: "PDF processed successfully",
        description: `Found ${parseData.items.length} menu items`
      });

    } catch (error) {
      console.error('Error processing PDF:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Could not process PDF",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
      setUploadProgress('');
    }
  };

  const handleImport = async () => {
    if (!selectedCategory) {
      toast({
        title: "No category selected",
        description: "Please select a category before importing",
        variant: "destructive"
      });
      return;
    }

    if (markAsSpecial && (!startDate || !endDate)) {
      toast({
        title: "Missing dates",
        description: "Please set both start and end dates for special items",
        variant: "destructive"
      });
      return;
    }

    if (markAsSpecial && endDate && startDate && endDate <= startDate) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setUploadProgress('Importing items...');

    try {
      // Clear existing items if requested
      if (clearExisting) {
        const deleteQuery = supabase
          .from('menu_items')
          .delete()
          .eq('category_id', selectedCategory);

        if (markAsSpecial) {
          deleteQuery.eq('is_special', true);
        }

        const { error: deleteError } = await deleteQuery;
        if (deleteError) throw deleteError;
      }

      // Prepare items for insertion
      const itemsToInsert = editedItems.map((item, index) => ({
        category_id: selectedCategory,
        name: item.name,
        description: item.description || null,
        price: item.price || null,
        tags: item.tags.length > 0 ? item.tags : null,
        is_special: markAsSpecial,
        is_featured: markFeatured,
        is_available: markAsSpecial ? (startDate && startDate <= new Date()) : true,
        special_start_date: markAsSpecial && startDate ? format(startDate, 'yyyy-MM-dd') : null,
        special_end_date: markAsSpecial && endDate ? format(endDate, 'yyyy-MM-dd') : null,
        sort_order: index
      }));

      // Bulk insert
      const { error: insertError } = await supabase
        .from('menu_items')
        .insert(itemsToInsert);

      if (insertError) throw insertError;

      toast({
        title: "Import successful",
        description: `${editedItems.length} menu items imported successfully`
      });

      onImportComplete();
      handleClose();

    } catch (error) {
      console.error('Error importing items:', error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Could not import items",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
      setUploadProgress('');
    }
  };

  const handleClose = () => {
    setStep('upload');
    setPdfFile(null);
    setPdfUrl('');
    setSelectedCategory(defaultCategoryId || '');
    setStartDate(undefined);
    setEndDate(undefined);
    setClearExisting(false);
    setMarkFeatured(false);
    setMarkAsSpecial(false);
    setParsedItems([]);
    setEditedItems([]);
    setUploadProgress('');
    onOpenChange(false);
  };

  const removeItem = (index: number) => {
    setEditedItems(editedItems.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload PDF Menu</DialogTitle>
          <DialogDescription>
            Upload a PDF menu to automatically extract and import menu items
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload PDF File</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    {pdfFile ? (
                      <>
                        <FileText className="h-12 w-12 text-primary" />
                        <p className="font-medium">{pdfFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <p className="font-medium">Click to browse or drag & drop PDF here</p>
                        <p className="text-sm text-muted-foreground">Maximum file size: 10MB</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={() => setStep('category')} disabled={!pdfFile}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 'category' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Select Target Category</Label>
              <p className="text-sm text-muted-foreground">
                Choose which category these menu items should be added to
              </p>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.section.name} - {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
              <Button onClick={() => setStep('options')} disabled={!selectedCategory}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 'options' && (
          <div className="space-y-6">
            {/* Import Options */}
            <div className="space-y-3">
              <Label>Import Settings</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="clear" 
                  checked={clearExisting} 
                  onCheckedChange={(checked) => setClearExisting(checked === true)} 
                />
                <label htmlFor="clear" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Replace existing items in selected category
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={markFeatured} 
                  onCheckedChange={(checked) => setMarkFeatured(checked === true)} 
                />
                <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mark all items as featured
                </label>
              </div>
              {allowSpecialScheduling && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="special" 
                    checked={markAsSpecial} 
                    onCheckedChange={(checked) => setMarkAsSpecial(checked === true)} 
                  />
                  <label htmlFor="special" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Mark as Monthly Special
                  </label>
                </div>
              )}
            </div>

            {/* Date Selection - only show if markAsSpecial is true */}
            {markAsSpecial && (
              <div className="space-y-4">
                <Label>Schedule Menu Dates</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "w-full justify-start text-left font-normal", 
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          mode="single" 
                          selected={startDate} 
                          onSelect={setStartDate} 
                          initialFocus 
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={cn(
                            "w-full justify-start text-left font-normal", 
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          mode="single" 
                          selected={endDate} 
                          onSelect={setEndDate} 
                          initialFocus 
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={activateImmediately}>
                    Activate Immediately
                  </Button>
                  <Button variant="outline" size="sm" onClick={setNextMonthDates}>
                    Set to Next Month
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('category')}>Back</Button>
              <Button onClick={handleProcessPdf} disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadProgress}
                  </>
                ) : (
                  <>Process PDF</>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div>
                <h3 className="font-semibold">Review Parsed Menu Items</h3>
                <p className="text-sm text-muted-foreground">Found {editedItems.length} items. Review before importing.</p>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {editedItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold">{item.name}</h4>
                        {item.price > 0 && (
                          <span className="text-sm font-medium text-muted-foreground">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                        {item.tags.length > 0 && (
                          <div className="flex gap-1">
                            {item.tags.map((tag, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}
                      {item.confidence < 0.8 && (
                        <div className="flex items-center gap-1 mt-2">
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                          <span className="text-xs text-yellow-600">Low confidence - please review</span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('options')}>Back</Button>
              <Button onClick={handleImport} disabled={processing || editedItems.length === 0}>
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>Import {editedItems.length} Items</>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
