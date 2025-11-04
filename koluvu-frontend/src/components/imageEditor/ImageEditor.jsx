"use client";

import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";

// Helper: create cropped image from source and pixelCrop, apply filters
async function getCroppedImg(imageSrc, pixelCrop, { brightness = 100, contrast = 100, filter = "none" } = {}) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  // Build filter string
  const filters = [];
  if (filter === "grayscale") filters.push("grayscale(100%)");
  if (filter === "sepia") filters.push("sepia(60%)");
  if (filter === "blur") filters.push("blur(2px)");
  filters.push(`brightness(${brightness}%)`);
  filters.push(`contrast(${contrast}%)`);
  ctx.filter = filters.join(" ");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

// Enhanced ImageEditor using react-easy-crop
export default function ImageEditor({ image = null, onSave = () => {}, onCancel = () => {} }) {
  const inputRef = useRef(null);
  const [src, setSrc] = useState(image);
  const [mode, setMode] = useState("crop");

  // cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(null); // null = free
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // adjustments
  const [filter, setFilter] = useState("none");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  // computed CSS filter string for live preview
  const filterString = (() => {
    const parts = [];
    if (filter === "grayscale") parts.push("grayscale(100%)");
    if (filter === "sepia") parts.push("sepia(60%)");
    if (filter === "blur") parts.push("blur(2px)");
    parts.push(`brightness(${brightness}%)`);
    parts.push(`contrast(${contrast}%)`);
    return parts.join(" ");
  })();

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleChangePhotoClick = () => inputRef.current?.click();

  const handleDelete = () => {
    if (confirm("Delete background photo? This will remove the image.")) {
      onSave(null);
    }
  };

  const handleSave = async () => {
    if (!src) {
      onSave(null);
      return;
    }

    // If crop area is present, crop; otherwise take full image
    let result = src;
    if (croppedAreaPixels && (croppedAreaPixels.width > 0 && croppedAreaPixels.height > 0)) {
      // get cropped image with adjustments
      result = await getCroppedImg(src, croppedAreaPixels, { brightness, contrast, filter });
    } else {
      // apply filters/adjustments to full image by drawing full image onto canvas
      const img = await loadImage(src);
      const fullCrop = { x: 0, y: 0, width: img.width, height: img.height };
      result = await getCroppedImg(src, fullCrop, { brightness, contrast, filter });
    }

    onSave(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Background Image Editor</h3>
          <div className="flex items-center space-x-2">
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">Close</button>
            <button onClick={handleSave} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-gray-50 flex items-start justify-center rounded overflow-hidden flex-col" style={{ minHeight: 320 }}>
            {src ? (
              <>
                <div className="relative w-full h-[420px]">
                  <Cropper
                    image={src}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect || undefined}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    showGrid={true}
                    imageStyle={{ filter: filterString }}
                  />
                </div>

                {/* Live preview (full image) to ensure filters/adjustments are visible immediately */}
                <div className="w-full p-2 border-t mt-2 bg-white">
                  <div className="text-xs text-gray-500 mb-1">Preview</div>
                  <div className="w-full flex items-center justify-center">
                    <img src={src} alt="preview" style={{ maxHeight: 140, width: '100%', objectFit: 'contain', filter: filterString }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">No image selected</div>
            )}
          </div>

          <div className="w-full md:w-80 flex flex-col">
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => setMode("crop")} className={`px-3 py-1 rounded ${mode === "crop" ? "bg-blue-50" : "bg-gray-100"}`}>Crop</button>
                <button onClick={() => setMode("filter")} className={`px-3 py-1 rounded ${mode === "filter" ? "bg-blue-50" : "bg-gray-100"}`}>Filter</button>
                <button onClick={() => setMode("adjust")} className={`px-3 py-1 rounded ${mode === "adjust" ? "bg-blue-50" : "bg-gray-100"}`}>Adjust</button>
              </div>

              {mode === "crop" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Aspect</label>
                  <div className="flex gap-2">
                    <button onClick={() => setAspect(null)} className={`px-2 py-1 rounded ${aspect === null ? "ring-2 ring-blue-200" : "bg-gray-100"}`}>Free</button>
                    <button onClick={() => setAspect(1)} className={`px-2 py-1 rounded ${aspect === 1 ? "ring-2 ring-blue-200" : "bg-gray-100"}`}>1:1</button>
                    <button onClick={() => setAspect(16/9)} className={`px-2 py-1 rounded ${Math.abs((aspect || 0) - 16/9) < 0.001 ? "ring-2 ring-blue-200" : "bg-gray-100"}`}>16:9</button>
                    <button onClick={() => setAspect(4/3)} className={`px-2 py-1 rounded ${Math.abs((aspect || 0) - 4/3) < 0.001 ? "ring-2 ring-blue-200" : "bg-gray-100"}`}>4:3</button>
                  </div>

                  <label className="text-sm font-medium">Zoom</label>
                  <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
                </div>
              )}

              {mode === "filter" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setFilter("none")} className={`p-2 border rounded ${filter === "none" ? "ring-2 ring-blue-200" : ""}`}>None</button>
                    <button onClick={() => setFilter("grayscale")} className={`p-2 border rounded ${filter === "grayscale" ? "ring-2 ring-blue-200" : ""}`}>Grayscale</button>
                    <button onClick={() => setFilter("sepia")} className={`p-2 border rounded ${filter === "sepia" ? "ring-2 ring-blue-200" : ""}`}>Sepia</button>
                    <button onClick={() => setFilter("blur")} className={`p-2 border rounded ${filter === "blur" ? "ring-2 ring-blue-200" : ""}`}>Soft Blur</button>
                  </div>
                </div>
              )}

              {mode === "adjust" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Brightness: {brightness}%</label>
                  <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" />
                  <label className="text-sm font-medium">Contrast: {contrast}%</label>
                  <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full" />
                </div>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <button onClick={handleChangePhotoClick} className="w-full px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">Change Photo</button>
              <button onClick={handleDelete} className="w-full px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete Photo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
