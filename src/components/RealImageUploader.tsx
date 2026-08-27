import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  CheckCircle2, 
  Loader2, 
  Camera, 
  HardDrive,
  AlertCircle 
} from 'lucide-react';
import { uploadRealFileToStorage, UploadResult } from '../services/storageService';

interface RealImageUploaderProps {
  label?: string;
  helperText?: string;
  folder: 'products' | 'profiles' | 'documents' | 'vehicles' | 'disputes';
  multiple?: boolean;
  maxFiles?: number;
  initialImages?: string[];
  onImagesChange: (imageUrls: string[]) => void;
  required?: boolean;
}

export const RealImageUploader: React.FC<RealImageUploaderProps> = ({
  label = 'Fotografia Real do Produto / Lote',
  helperText = 'Envie fotos reais da sua colheita ou armazém (PNG, JPG, WebP até 10MB)',
  folder,
  multiple = true,
  maxFiles = 4,
  initialImages = [],
  onImagesChange,
  required = false
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage('');

    const filesArray = Array.from(files);

    // Validate number of files
    if (images.length + filesArray.length > maxFiles) {
      setErrorMessage(`Pode anexar no máximo ${maxFiles} fotos reais.`);
      return;
    }

    // Validate file sizes
    for (const file of filesArray) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`O ficheiro ${file.name} excede o limite de 10MB.`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrorMessage(`O ficheiro ${file.name} não é uma imagem válida.`);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(10);

    const newUploadedUrls: string[] = [];

    try {
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        const result: UploadResult = await uploadRealFileToStorage(
          file, 
          folder, 
          (prog) => {
            const overall = Math.round(((i + prog / 100) / filesArray.length) * 100);
            setUploadProgress(overall);
          }
        );
        newUploadedUrls.push(result.url);
      }

      const updatedImages = multiple ? [...images, ...newUploadedUrls] : newUploadedUrls;
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (err) {
      console.error('Falha no upload para Firebase Storage:', err);
      setErrorMessage('Erro ao carregar ficheiro para a Cloud Firebase. Tente novamente.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
          <HardDrive className="w-3 h-3 text-emerald-600" />
          <span>Firebase Storage Activo</span>
        </div>
      </div>

      {/* Upload Dropzone / Button */}
      {images.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
            dragOver 
              ? 'border-[#FF6B00] bg-amber-50/50' 
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {isUploading ? (
            <div className="py-3 flex flex-col items-center space-y-2">
              <Loader2 className="w-7 h-7 text-[#FF6B00] animate-spin" />
              <div className="text-xs font-bold text-slate-800">
                A carregar foto real para o Firebase Storage... ({uploadProgress}%)
              </div>
              <div className="w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#FF6B00] h-full transition-all duration-200" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700">
                <UploadCloud className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div className="text-xs text-slate-700">
                <strong className="text-slate-900 font-bold">Clique para tirar foto ou carregar ficheiro</strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">{helperText}</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                <Camera className="w-3 h-3 text-[#FF6B00]" />
                <span>Suporta Câmara & Galeria do Dispositivo</span>
              </div>
            </>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Thumbnails of Real Uploaded Photos */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {images.map((imgUrl, index) => (
            <div 
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-500/80 group shadow-xs bg-slate-100"
            >
              <img 
                src={imgUrl} 
                alt={`Foto Real ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-1.5 left-1.5 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center space-x-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Real</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer"
                title="Remover foto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
