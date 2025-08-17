import React, { useState, useRef } from 'react';
import { Upload, X, Camera, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onImageRemove: () => void;
  currentImage?: string | null;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  currentImage,
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif'],
  className = ''
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Please select a valid image file (${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')})`;
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageSelect(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setError(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      {!currentImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div>
            <span className="text-sm font-medium text-gray-900">
              Click to upload or drag and drop
            </span>
            <p className="text-sm text-gray-500 mt-1">
              {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} up to {maxSize}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={currentImage}
            alt="Profile preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mt-3">
            <button
              type="button"
              onClick={triggerFileInput}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Change photo
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}