"use client"
import { useState } from 'react';
import { Upload, Camera, Sparkles, Copy, Check } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear previous caption
      setCaption('');
    }
  };

  const handleUpload = async () => {
  if (!image) return;

  setIsLoading(true);
  const formData = new FormData();
  formData.append("file", image);

  try {
    const res = await fetch("http://127.0.0.1:8000/generate-caption", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setCaption(data.caption || "⚠️ Failed to generate a caption.");
  } catch (err: any) {
    console.error("Upload failed:", err);
    alert("Upload failed: " + err.message);
  } finally {
    setIsLoading(false);
  }
};


  const handleCopy = async () => {
    if (caption) {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setCaption('');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              AI Caption Generator
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Transform your photos into viral social media posts</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div 
              className="relative border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center bg-black/20 backdrop-blur-sm hover:border-purple-400 transition-all duration-300 group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {!imagePreview ? (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg mb-2">Drop your image here</p>
                    <p className="text-gray-400">or click to browse</p>
                    <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, WebP</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-2xl"
                  />
                  <p className="text-gray-300">Click to change image</p>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleUpload}
              disabled={!image || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Caption
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Your Caption
              </h3>
              
              {!caption && !isLoading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400">Upload an image to generate your perfect caption</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto"></div>
                  </div>
                  <p className="text-purple-400 mt-4">AI is crafting your perfect caption...</p>
                </div>
              )}

              {caption && !isLoading && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/30">
                    <p className="text-white leading-relaxed">{caption}</p>
                  </div>
                  
                  <button
                    onClick={handleCopy}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-600"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Caption
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-3">✨ Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  AI-powered caption generation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Optimized for social media
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  Hashtag suggestions included
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  One-click copy to clipboard
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

