
import React from 'react';
import PhotoBoothForm from '@/components/photobooth/PhotoBoothForm';
import PhotoGallery from '@/components/photobooth/PhotoGallery';
import ValuePropsSection from '@/components/photobooth/ValuePropsSection';
import QRCodeGenerator from '@/components/qr-generator/QRCodeGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PhotoBooth = () => {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-serif">Be Part of the Story 📸</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Share your best moments at Champions and get featured on our wall of fame and social media!
        </p>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload">Photo Upload</TabsTrigger>
            <TabsTrigger value="qr-generator">QR Code Generator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <PhotoBoothForm />
              <PhotoGallery />
            </div>
            <ValuePropsSection />
          </TabsContent>
          
          <TabsContent value="qr-generator">
            <QRCodeGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PhotoBooth;
