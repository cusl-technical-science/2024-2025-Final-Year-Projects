"use client";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

import { storage } from " @/config/firebase.config"; // ✅ Fixed import

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsLoading(true);

    const fileRef = ref(storage, `JobCoverImage/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file, { contentType: file.type });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        toast.error(error.message);
        setIsLoading(false);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadUrl);
          toast.success("Image uploaded");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
        
          
          toast.error("Failed to get image URL");
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const onDelete = async () => {
    try {
      await deleteObject(ref(storage, value));
      onRemove(value);
      toast.success("Image removed");
    } catch (error) {
      toast.error("Error removing image");
      console.error(error);
    }
  };

  return (
    <div>
      {value ? (
        <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden">
          <Image
            fill
            className="w-full h-full object-cover"
            alt="Image cover"
            src={value}
          />
          <div
            className="absolute z-10 top-2 right-2 cursor-pointer"
            onClick={onDelete}
          >
            <Button size="icon" variant="destructive" disabled={disabled}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden border border-dashed bg-neutral-50">
          {isLoading ? (
            <p>{`${progress.toFixed(2)}%`}</p>
          ) : (
            <label>
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer text-neutral-500">
                <ImagePlus className="w-10 h-10" />
                <p>Upload an image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden" // ✅ Use 'hidden' instead of "w-0 h-0"
                onChange={onUpload}
                disabled={disabled} // ✅ Properly handle the disabled state
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};
