import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CalendarIcon, Loader2, FileText, ImageIcon, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import * as pdfjsLib from 'pdfjs-dist';

type DuplicateHandling = 'update' | 'skip' | 'fail';

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

const ACCEPTED_EXTENSIONS = '.pdf,.jpg,.jpeg,.png,.webp,.gif';

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
  const [files, setFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategoryId || '');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [clearExisting, setClearExisting] = useState(false);
  const [markFeatured, setMarkFeatured] = useState(false);
  const [markAsSpecial, setMarkAsSpecial] = useState(false);
  const [duplicateHandling, setDuplicateHandling] = useState<DuplicateHandling>('update');
  const [processing, setProcessing] = useState(false);
  const [parsedItems, setParsedItems] = useState<ParsedMenuItem[]>([]);
  const [editedItems, setEditedItems] = useState<ParsedMenuItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Auto-enable "Replace existing" when marking as monthly special to ensure old specials are removed
  useEffect(() => {
    if (markAsSpecial) {
      setClearExisting(true);
    }
  }, [markAsSpecial]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const validFiles: File[] = [];
    for (const file of selectedFiles) {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported format. Use PDF, JPEG, PNG, WebP, or GIF.`,
          variant: "destructive"
        });
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Convert image file to base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

  // Convert PDF page to base64 image
  const convertPdfPageToImage = async (pdf: any, pageNum: number): Promise<string> => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    return canvas.toDataURL('image/png');
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "Missing files",
        description: "Please select at least one file",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setUploadProgress('Processing files...');

    try {
      const pageImages: string[] = [];

      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        
        if (file.type === 'application/pdf') {
          // Handle PDF files
          setUploadProgress(`Processing PDF ${fileIndex + 1} of ${files.length}...`);
          
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          
          for (let i = 1; i <= pdf.numPages; i++) {
            setUploadProgress(`Converting PDF page ${i} of ${pdf.numPages}...`);
            const imageData = await convertPdfPageToImage(pdf, i);
            pageImages.push(imageData);
          }
        } else {
          // Handle image files directly
          setUploadProgress(`Processing image ${fileIndex + 1} of ${files.length}...`);
          const imageData = await convertImageToBase64(file);
          pageImages.push(imageData);
        }
      }

      setUploadProgress('Parsing menu items from images...');

      const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-menu-pdf', {
        body: { images: pageImages }
      });

      if (parseError) throw parseError;

      if (!parseData.items || parseData.items.length === 0) {
        toast({
          title: "No items found",
          description: "Could not extract menu items. Please check the file format.",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }

      setParsedItems(parseData.items);
      setEditedItems(parseData.items);
      setStep('review');
      
      toast({
        title: "Files processed successfully",
        description: `Found ${parseData.items.length} menu items`
      });

    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Could not process files",
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
        let deleteQuery = supabase
          .from('menu_items')
          .delete()
          .eq('category_id', selectedCategory);

        if (markAsSpecial) {
          deleteQuery = deleteQuery.eq('is_special', true);
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

      // Handle import based on duplicate handling preference
      if (duplicateHandling === 'update') {
        // Upsert: update existing items with same name in category
        const { error: upsertError } = await supabase
          .from('menu_items')
          .upsert(itemsToInsert, { 
            onConflict: 'name,category_id',
            ignoreDuplicates: false
          });
        if (upsertError) throw upsertError;
      } else if (duplicateHandling === 'skip') {
        // Skip duplicates: only insert new items
        const { error: insertError } = await supabase
          .from('menu_items')
          .upsert(itemsToInsert, { 
            onConflict: 'name,category_id',
            ignoreDuplicates: true
          });
        if (insertError) throw insertError;
      } else {
        // Fail on duplicates: use regular insert
        const { error: insertError } = await supabase
          .from('menu_items')
          .insert(itemsToInsert);
        if (insertError) {
          if (insertError.message.includes('duplicate key')) {
            throw new Error('Duplicate items found. Use "Update existing" or "Skip duplicates" to handle conflicts.');
          }
          throw insertError;
        }
      }

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
    setFiles([]);
    setSelectedCategory(defaultCategoryId || '');
    setStartDate(undefined);
    setEndDate(undefined);
    setClearExisting(false);
    setMarkFeatured(false);
    setMarkAsSpecial(false);
    setDuplicateHandling('update');
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
          <DialogTitle>Upload Menu File</DialogTitle>
          <DialogDescription>
            Upload PDF or image files to automatically extract and import menu items
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload Files</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept={ACCEPTED_EXTENSIONS}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="menu-upload"
                  multiple
                />
                <label htmlFor="menu-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="font-medium">Click to browse or drag & drop files here</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, JPEG, PNG, WebP, GIF • Max 10MB per file
                    </p>
                  </div>
                </label>
              </div>

              {/* Selected files list */}
              {files.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Selected Files ({files.length})</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          {file.type === 'application/pdf' ? (
                            <FileText className="h-5 w-5 text-primary" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-primary" />
                          )}
                          <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={() => setStep('category')} disabled={files.length === 0}>
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

            {/* Duplicate Handling */}
            {!clearExisting && (
              <div className="space-y-3">
                <Label>How to handle duplicates</Label>
                <p className="text-sm text-muted-foreground">
                  Choose what happens if items with the same name already exist
                </p>
                <RadioGroup 
                  value={duplicateHandling} 
                  onValueChange={(value) => setDuplicateHandling(value as DuplicateHandling)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="update" id="dup-update" />
                    <label htmlFor="dup-update" className="text-sm font-medium leading-none cursor-pointer">
                      Update existing items (recommended)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="skip" id="dup-skip" />
                    <label htmlFor="dup-skip" className="text-sm font-medium leading-none cursor-pointer">
                      Skip duplicates (only add new items)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fail" id="dup-fail" />
                    <label htmlFor="dup-fail" className="text-sm font-medium leading-none cursor-pointer">
                      Fail on duplicates (strict mode)
                    </label>
                  </div>
                </RadioGroup>
              </div>
            )}

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
              <Button onClick={handleProcessFiles} disabled={processing}>
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
