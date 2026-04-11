import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Upload, Loader2, FileText, ImageIcon, CheckCircle2, ChevronRight,
  ChevronLeft, AlertCircle, Check, X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import * as pdfjsLib from 'pdfjs-dist';

interface ParsedItem {
  name: string;
  description: string;
  price: number;
  tags: string[];
  confidence: number;
}

interface ParsedSection {
  sectionName: string;
  items: ParsedItem[];
  confirmed: boolean;
  targetCategoryId: string;
}

type WizardStep = 'upload' | 'parsing' | 'review' | 'final' | 'done';

interface MainMenuUploadWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: () => void;
}

export default function MainMenuUploadWizard({ open, onOpenChange, onImportComplete }: MainMenuUploadWizardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<WizardStep>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [sections, setSections] = useState<ParsedSection[]>([]);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [publishing, setPublishing] = useState(false);

  // Fetch existing categories
  const { data: categories } = useQuery({
    queryKey: ['menu-cats-wizard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('id, name, section:menu_sections(name)')
        .order('section_id')
        .order('sort_order');
      if (error) throw error;
      return data as Array<{ id: string; name: string; section: { name: string } }>;
    },
  });

  const ACCEPTED = '.pdf,.jpg,.jpeg,.png,.webp';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f => f.size <= 10 * 1024 * 1024);
    if (valid.length > 0) setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const convertImageToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const convertPdfPageToImage = async (pdf: any, pageNum: number): Promise<string> => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL('image/jpeg', 0.7);
  };

  const handleParse = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setStep('parsing');

    try {
      const pageImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'application/pdf') {
          setProgress(`Processing PDF ${i + 1}/${files.length}...`);
          try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
              'pdfjs-dist/build/pdf.worker.min.mjs',
              import.meta.url
            ).toString();
          } catch {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
          }
          
          let pdf;
          try {
            const buf = await file.arrayBuffer();
            pdf = await pdfjsLib.getDocument({ data: buf }).promise;
          } catch (pdfError) {
            throw new Error(`Could not read "${file.name}". The PDF may be corrupted or password-protected. Try re-saving it or converting to JPEG.`);
          }
          
          for (let p = 1; p <= pdf.numPages; p++) {
            setProgress(`Converting page ${p}/${pdf.numPages}...`);
            pageImages.push(await convertPdfPageToImage(pdf, p));
          }
        } else {
          setProgress(`Processing image ${i + 1}/${files.length}...`);
          pageImages.push(await convertImageToBase64(file));
        }
      }

      // Send images in batches of 2 to avoid payload size limits
      setProgress('Parsing menu items...');
      const BATCH_SIZE = 2;
      const allItems: ParsedItem[] = [];

      for (let i = 0; i < pageImages.length; i += BATCH_SIZE) {
        const batch = pageImages.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(pageImages.length / BATCH_SIZE);
        
        if (totalBatches > 1) {
          setProgress(`Parsing batch ${batchNum} of ${totalBatches}...`);
        }

        const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-menu-pdf', {
          body: { images: batch },
        });
        
        if (parseError) {
          const errorMsg = parseError.message || '';
          if (errorMsg.includes('413') || errorMsg.includes('payload') || errorMsg.includes('too large')) {
            throw new Error('The file is too large to process. Try uploading a smaller PDF or fewer pages at a time.');
          }
          throw new Error(`Failed to parse menu (batch ${batchNum}): ${errorMsg}`);
        }

        if (parseData?.items) {
          allItems.push(...parseData.items);
        }
      }

      if (allItems.length === 0) {
        toast({ title: 'No items found', description: 'Could not extract items from the file. Try uploading a clearer image or PDF.', variant: 'destructive' });
        setStep('upload');
        return;
      }

      // Group items by detected section
      const sectionMap = new Map<string, ParsedItem[]>();
      for (const item of allItems) {
        const sectionName = (item as any).section || 'Uncategorized';
        if (!sectionMap.has(sectionName)) sectionMap.set(sectionName, []);
        sectionMap.get(sectionName)!.push(item);
      }

      // Auto-match categories by name
      const parsedSections: ParsedSection[] = Array.from(sectionMap.entries()).map(([name, items]) => {
        const matchedCat = categories?.find(c => c.name.toLowerCase() === name.toLowerCase());
        return {
          sectionName: name,
          items,
          confirmed: false,
          targetCategoryId: matchedCat?.id || '',
        };
      });

      setSections(parsedSections);
      setCurrentSectionIdx(0);
      setStep('review');

      toast({ title: 'Parsing complete', description: `Found ${allItems.length} items in ${parsedSections.length} sections.` });
    } catch (err) {
      console.error(err);
      toast({ title: 'Parsing failed', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
      setStep('upload');
    } finally {
      setProcessing(false);
      setProgress('');
    }
  };

  // Section editing helpers
  const currentSection = sections[currentSectionIdx];

  const updateSectionField = (field: keyof ParsedSection, value: any) => {
    setSections(prev => prev.map((s, i) => i === currentSectionIdx ? { ...s, [field]: value } : s));
  };

  const updateItem = (itemIdx: number, field: keyof ParsedItem, value: any) => {
    setSections(prev => prev.map((s, i) => {
      if (i !== currentSectionIdx) return s;
      const newItems = [...s.items];
      newItems[itemIdx] = { ...newItems[itemIdx], [field]: value };
      return { ...s, items: newItems };
    }));
  };

  const removeItem = (itemIdx: number) => {
    setSections(prev => prev.map((s, i) => {
      if (i !== currentSectionIdx) return s;
      return { ...s, items: s.items.filter((_, idx) => idx !== itemIdx) };
    }));
  };

  const confirmSection = () => {
    updateSectionField('confirmed', true);
    if (currentSectionIdx < sections.length - 1) {
      setCurrentSectionIdx(currentSectionIdx + 1);
    } else {
      setStep('final');
    }
  };

  const goToSection = (idx: number) => {
    setCurrentSectionIdx(idx);
    setStep('review');
  };

  // Final publish
  const handlePublish = async () => {
    const unassigned = sections.filter(s => !s.targetCategoryId);
    if (unassigned.length > 0) {
      toast({ title: 'Missing categories', description: `${unassigned.length} section(s) don't have a target category assigned.`, variant: 'destructive' });
      return;
    }

    setPublishing(true);
    try {
      for (const section of sections) {
        const itemsToInsert = section.items.map((item, idx) => ({
          category_id: section.targetCategoryId,
          name: item.name,
          description: item.description || null,
          price: item.price || null,
          tags: item.tags.length > 0 ? item.tags : null,
          is_available: true,
          is_special: false,
          is_featured: false,
          sort_order: idx,
        }));

        const { error } = await supabase
          .from('menu_items')
          .upsert(itemsToInsert, { onConflict: 'name,category_id', ignoreDuplicates: false });

        if (error) throw error;
      }

      setStep('done');
      toast({ title: 'Menu published!', description: `All ${sections.length} sections have been updated.` });
      onImportComplete?.();
    } catch (err) {
      console.error(err);
      toast({ title: 'Publish failed', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setPublishing(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFiles([]);
    setSections([]);
    setCurrentSectionIdx(0);
    onOpenChange(false);
  };

  const confirmedCount = sections.filter(s => s.confirmed).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {step === 'upload' && 'Upload Main Menu'}
            {step === 'parsing' && 'Processing Menu...'}
            {step === 'review' && `Review Section ${currentSectionIdx + 1} of ${sections.length}`}
            {step === 'final' && 'Final Review — Approve & Publish'}
            {step === 'done' && 'Menu Published'}
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' && 'Upload your menu file to begin the section-by-section verification process.'}
            {step === 'parsing' && progress}
            {step === 'review' && 'Verify names, prices, and descriptions. Confirm each section before moving on.'}
            {step === 'final' && 'Review all sections. When ready, click Approve & Publish to update the menu.'}
            {step === 'done' && 'All menu items have been updated successfully.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {/* UPLOAD STEP */}
          {step === 'upload' && (
            <div className="space-y-4 py-2">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Input type="file" accept={ACCEPTED} onChange={handleFileSelect} className="hidden" id="wizard-upload" multiple />
                <label htmlFor="wizard-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="font-medium text-sm">Click to select files</p>
                    <p className="text-xs text-muted-foreground">PDF, JPEG, PNG, WebP • Max 10MB</p>
                  </div>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      {f.type === 'application/pdf' ? <FileText className="h-4 w-4 text-red-500" /> : <ImageIcon className="h-4 w-4 text-blue-500" />}
                      <span className="text-sm truncate flex-1">{f.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(i)}><X className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PARSING STEP */}
          {step === 'parsing' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{progress}</p>
            </div>
          )}

          {/* REVIEW STEP — one section at a time */}
          {step === 'review' && currentSection && (
            <div className="space-y-4 py-2">
              {/* Section progress */}
              <div className="flex items-center gap-2 flex-wrap">
                {sections.map((s, i) => (
                  <Badge
                    key={i}
                    variant={i === currentSectionIdx ? 'default' : s.confirmed ? 'secondary' : 'outline'}
                    className="cursor-pointer gap-1"
                    onClick={() => goToSection(i)}
                  >
                    {s.confirmed && <Check className="h-3 w-3" />}
                    {s.sectionName}
                  </Badge>
                ))}
              </div>

              <Separator />

              {/* Section name & category mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Section Name</Label>
                  <Input
                    value={currentSection.sectionName}
                    onChange={e => updateSectionField('sectionName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Map to Category</Label>
                  <Select value={currentSection.targetCategoryId} onValueChange={v => updateSectionField('targetCategoryId', v)}>
                    <SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
                    <SelectContent>
                      {categories?.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.section.name} → {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Items list */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">{currentSection.items.length} Items</Label>
                {currentSection.items.map((item, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input
                          value={item.name}
                          onChange={e => updateItem(idx, 'name', e.target.value)}
                          placeholder="Item name"
                          className="sm:col-span-2"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={item.price || ''}
                          onChange={e => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="Price"
                        />
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeItem(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={item.description}
                      onChange={e => updateItem(idx, 'description', e.target.value)}
                      placeholder="Description"
                      rows={2}
                      className="text-sm"
                    />
                    {item.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.map((tag, ti) => <Badge key={ti} variant="outline" className="text-xs">{tag}</Badge>)}
                      </div>
                    )}
                    {item.confidence < 0.7 && (
                      <div className="flex items-center gap-1 text-amber-600 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        Low confidence — please verify
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FINAL REVIEW */}
          {step === 'final' && (
            <div className="space-y-4 py-2">
              {sections.map((s, i) => {
                const cat = categories?.find(c => c.id === s.targetCategoryId);
                return (
                  <Card key={i} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => goToSection(i)}>
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {s.confirmed ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                          <CardTitle className="text-sm">{s.sectionName}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{s.items.length} items</Badge>
                          {cat && <Badge variant="outline" className="text-xs">{cat.name}</Badge>}
                          {!s.targetCategoryId && <Badge variant="destructive" className="text-xs">No category</Badge>}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}

          {/* DONE */}
          {step === 'done' && (
            <div className="flex flex-col items-center gap-3 py-8">
              <CheckCircle2 className="h-14 w-14 text-green-600" />
              <p className="font-medium text-lg">Menu Updated Successfully</p>
              <p className="text-sm text-muted-foreground">All {sections.reduce((sum, s) => sum + s.items.length, 0)} items across {sections.length} sections have been published.</p>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          {step === 'upload' && (
            <Button onClick={handleParse} disabled={files.length === 0 || processing}>
              {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Parse Menu <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {step === 'review' && currentSection && (
            <>
              {currentSectionIdx > 0 && (
                <Button variant="outline" onClick={() => setCurrentSectionIdx(currentSectionIdx - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
              )}
              <Button onClick={confirmSection} disabled={!currentSection.targetCategoryId}>
                {currentSection.confirmed ? <Check className="h-4 w-4 mr-1" /> : null}
                {currentSectionIdx < sections.length - 1 ? 'Confirm & Next' : 'Confirm & Review All'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </>
          )}

          {step === 'final' && (
            <>
              <Button variant="outline" onClick={() => goToSection(sections.length - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button onClick={handlePublish} disabled={publishing || sections.some(s => !s.targetCategoryId)}>
                {publishing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Approve & Publish
              </Button>
            </>
          )}

          {step === 'done' && <Button onClick={handleClose}>Done</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
