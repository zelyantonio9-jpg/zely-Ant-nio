import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { storage } from '../firebase';

export interface UploadResult {
  url: string;
  fullPath: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Utility to compress an image file before uploading, saving mobile data in Angola
 */
export async function compressImageFile(
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.82
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If not an image, return original file
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Upload a real file to Firebase Storage under a designated folder
 * @param file The file or image from the user
 * @param folder e.g., 'products', 'profiles', 'documents', 'vehicles', 'disputes'
 * @param onProgress Optional progress callback (0-100%)
 */
export async function uploadRealFileToStorage(
  file: File,
  folder: 'products' | 'profiles' | 'documents' | 'vehicles' | 'disputes' | 'general' = 'products',
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `ao_market_uploads/${folder}/${timestamp}_${sanitizedName}`;

  try {
    // 1. Client-side compression for images
    let uploadData: Blob = file;
    if (file.type.startsWith('image/')) {
      uploadData = await compressImageFile(file);
    }

    // 2. Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        platform: 'AO_MARKET_ANGOLA'
      }
    };

    const uploadTask = uploadBytesResumable(storageRef, uploadData, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        async (error) => {
          console.warn('Firebase Storage upload error, using resilient Base64 fallback:', error);
          // Resilient fallback to Base64 so real user submissions are never lost
          try {
            const fallbackUrl = await fileToBase64(file);
            resolve({
              url: fallbackUrl,
              fullPath: `local_fallback/${folder}/${timestamp}_${sanitizedName}`,
              name: file.name,
              size: file.size,
              type: file.type
            });
          } catch (e) {
            reject(error);
          }
        },
        async () => {
          // Upload completed successfully
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadUrl,
              fullPath: storagePath,
              name: file.name,
              size: uploadData.size,
              type: file.type
            });
          } catch (err) {
            const fallbackUrl = await fileToBase64(file);
            resolve({
              url: fallbackUrl,
              fullPath: storagePath,
              name: file.name,
              size: file.size,
              type: file.type
            });
          }
        }
      );
    });
  } catch (error) {
    console.warn('Direct upload error, falling back to base64 encoding:', error);
    const fallbackUrl = await fileToBase64(file);
    return {
      url: fallbackUrl,
      fullPath: `local_fallback/${folder}/${timestamp}_${sanitizedName}`,
      name: file.name,
      size: file.size,
      type: file.type
    };
  }
}

/**
 * Converts a file to base64 Data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Remove a file from Firebase Storage
 */
export async function deleteFileFromStorage(fullPath: string): Promise<boolean> {
  if (!fullPath || fullPath.startsWith('local_fallback/')) {
    return true;
  }
  try {
    const fileRef = ref(storage, fullPath);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    console.warn('Could not delete file from Firebase Storage:', error);
    return false;
  }
}
