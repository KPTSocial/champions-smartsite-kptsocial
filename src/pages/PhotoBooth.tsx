import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera } from 'lucide-react';

const PhotoBooth = () => {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-serif">Snap. Upload. Get Featured 📸</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Submit your favorite night-out pic for a chance to be featured on our socials!
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-card p-8 rounded-lg border">
          <h2 className="text-3xl font-serif font-semibold mb-6">Submit Your Photo</h2>
          
          <Alert className="mb-6 bg-accent/20 border-accent/50 text-accent-foreground">
            <Camera className="h-4 w-4" />
            <AlertTitle className="font-semibold">Demo Mode</AlertTitle>
            <AlertDescription>
              This form is a preview. File uploads require backend integration, which can be set up next!
            </AlertDescription>
          </Alert>
          
          <form className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Ashley R." defaultValue="Ashley R." readOnly className="bg-background/50" />
            </div>
            <div>
              <Label htmlFor="picture">Upload Photo</Label>
              <Input id="picture" type="file" disabled />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea id="caption" placeholder="Best night ever at Champions!" defaultValue="Best night ever at Champions!" readOnly className="bg-background/50" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="consent" checked disabled />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I consent to have this photo shared publicly.
              </label>
            </div>
            <Button type="submit" className="w-full" disabled>Submit Photo</Button>
          </form>
        </div>
        <div>
          <h2 className="text-3xl font-serif font-semibold mb-6">Recent Uploads</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <img src="https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=2188&auto=format=fit=crop" alt="Guest photo" className="rounded-lg object-cover aspect-square shadow-md"/>
              <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1951&auto=format=fit=crop" alt="Guest photo" className="rounded-lg object-cover aspect-square shadow-md"/>
              <img src="https://images.unsplash.com/photo-1533540232-404043745853?q=80&w=2187&auto=format=fit=crop" alt="Guest photo" className="rounded-lg object-cover aspect-square shadow-md"/>
              <img src="https://images.unsplash.com/photo-1551024709-8f23befc6f81?q=80&w=2187&auto=format=fit=crop" alt="Guest photo" className="rounded-lg object-cover aspect-square shadow-md"/>
              <img src="https://images.unsplash.com/photo-1574966779434-d9a2a3075c63?q=80&w=2187&auto=format=fit=crop" alt="Guest photo" className="rounded-lg object-cover aspect-square shadow-md"/>
              <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format=fit=crop" alt="Guest photo" className="rounded-lg object-cover aspect-square shadow-md"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoBooth;
