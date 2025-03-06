"use client";


import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FilePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { storage } from " @/config/firebase.config";
import { Button } from "./button";

interface AttachmentsUploadsProps {
  disabled?: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  value: { url: string; name: string }[];
}

export const AttachmentsUploads = ({
  disabled,
  onChange,
  value,
}: AttachmentsUploadsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the 10 MB limit`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    setIsLoading(true);
    const newUrls: { url: string; name: string }[] = [];
    let completedFiles = 0;

    validFiles.forEach((file: File) => {
      const uploadTask = uploadBytesResumable(
        ref(storage, `Attachments/${Date.now()}-${file.name}`),
        file,
        { contentType: file.type }
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setFileProgress((prev) => ({
            ...prev,
            [file.name]: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          completedFiles++;
          if (completedFiles === validFiles.length) {
            setIsLoading(false);
            onChange([...value, ...newUrls]);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadurl) => {
            newUrls.push({ url: downloadurl, name: file.name });
            completedFiles++;
            if (completedFiles === validFiles.length) {
              setIsLoading(false);
              onChange([...value, ...newUrls]);
            }
          });
        }
      );
    });
  };

  const onDelete = async (fileName: string) => {
    try {
      const fileRef = ref(storage, `Attachments/${fileName}`);
      await deleteObject(fileRef);
      onChange(value.filter((file) => file.name !== fileName));
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete ${fileName}: ${error}`);
      toast.error("Failed to delete file");
    }
  };

  return (
    <div>
      <div className="w-full h-40 bg-purple-100 p-2 flex items-center justify-center">
        {isLoading ? (
          <p>Uploading...</p>
        ) : (
          <label className="w-full h-full flex items-center justify-center cursor-pointer">
            <div className="flex gap-2 items-center">
              <FilePlus className="w-4 h-4" />
              <span>Add a file</span>
            </div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
              multiple
              className="hidden"
              onChange={onUpload}
            />
          </label>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {value.map((file) => (
          <div key={file.url} className="flex items-center gap-2">
            {file.name.endsWith(".jpg") || file.name.endsWith(".png") ? (
              <Image src={file.url} alt={file.name} width={50} height={50} />
            ) : (
              <FilePlus className="w-6 h-6" />
            )}
            <p className="text-sm">{file.name}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(file.name)}
              disabled={disabled || isLoading}
            >
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
