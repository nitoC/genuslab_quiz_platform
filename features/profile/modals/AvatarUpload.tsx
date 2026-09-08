"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

import GlassCard from "@/components/ui/cards/GlassCard";
import { getPresignedUrl, updateProfileImage } from "@/lib/api/apis";

import {
  BiCloudUpload,
  BiTrash,
  BiX,
  BiImage,
  BiLoaderAlt,
  BiCheckCircle,
} from "react-icons/bi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUserDetails } from "@/interfaces";
import { constants } from "@/app/constants";

interface AvatarUploadProps {
  handleModal: (value: boolean) => void;
  onUploaded?: (url: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_COMPRESSED_MB = 0.3;
const MAX_DIMENSION = 600;

function AvatarUpload({ handleModal, onUploaded }: AvatarUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: IUserDetails) => {
      return updateProfileImage(data);
    },
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({ queryKey: [constants.USER] });
    },
  });

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const compressImage = async (image: File) => {
    return await imageCompression(image, {
      maxSizeMB: MAX_COMPRESSED_MB,
      maxWidthOrHeight: MAX_DIMENSION,
      useWebWorker: true,
      initialQuality: 0.85,
    });
  };

  const uploadImage = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setProgress(5);
      setError("");

      const compressed = await compressImage(file);
      setProgress(20);

      const { data } = await getPresignedUrl(
        compressed.name,
        compressed.size,
        compressed.type,
      );

      const { payload: presigned } = data;

      const uploadUrl = presigned.uploadUrl;
      const imageUrl = presigned.fileUrl;

      console.log(presigned, "presigned");
      console.log(imageUrl, "presigned imageurl");

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          const percent = 20 + Math.round((event.loaded / event.total) * 80);
          setProgress(percent);
        };

        xhr.onload = () => {
          // Accept any 2xx response code (200, 201, 204 are common for cloud storage)
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));

        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", compressed.type);
        xhr.send(compressed);
      });

      setProgress(100);
      setSuccess(true);
      await mutation.mutateAsync({ avatar: imageUrl });
      onUploaded?.(imageUrl);

      setTimeout(() => {
        handleModal(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setError("Unable to upload image.");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview("");
    setProgress(0);
    setSuccess(false);
    setError("");
  };

  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length) return;
    setError("");
    setSuccess(false);
    setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
    },
    onDropRejected(rejections) {
      const reason = rejections[0]?.errors[0];
      if (!reason) return;

      switch (reason.code) {
        case "file-too-large":
          setError("Maximum image size is 5 MB.");
          break;
        case "file-invalid-type":
          setError("Only JPG, PNG and WEBP are supported.");
          break;
        default:
          setError(reason.message);
      }
    },
  });

  const readableSize = useMemo(() => {
    if (!file) return "";
    return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  }, [file]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <GlassCard className="relative w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Upload Avatar</h3>
            <button
              onClick={() => handleModal(false)}
              disabled={uploading}
              className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              <BiX size={24} />
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          {/* Main Dropzone / Preview Area */}
          <div className="mt-4">
            {!preview ? (
              <div
                {...getRootProps()}
                className={clsx(
                  "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition cursor-pointer",
                  isDragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/20 hover:border-white/40 hover:bg-white/5",
                )}
              >
                <input {...getInputProps()} />
                <BiCloudUpload className="mb-2 text-4xl text-white/60" />
                <p className="text-sm font-medium text-white">
                  Drag & drop your photo here, or{" "}
                  <span className="text-blue-400">browse</span>
                </p>
                <p className="mt-1 text-sm text-white/40">
                  PNG, JPG or WEBP (Max. 5 MB)
                </p>
              </div>
            ) : (
              <div className="relative flex flex-col items-center gap-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/20 shadow-inner">
                  <Image
                    src={preview}
                    alt="Avatar Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">
                    {file?.name}
                  </p>
                  <p className="text-sm text-white/50">{readableSize}</p>
                </div>

                {!uploading && !success && (
                  <button
                    onClick={removeImage}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
                  >
                    <BiTrash /> Remove
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4 space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-right text-sm text-white/60">{progress}%</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => handleModal(false)}
              disabled={uploading}
              className="rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={uploadImage}
              disabled={!file || uploading || success}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
                success
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:hover:bg-blue-600",
              )}
            >
              {uploading ? (
                <>
                  <BiLoaderAlt className="animate-spin" /> Uploading...
                </>
              ) : success ? (
                <>
                  <BiCheckCircle /> Uploaded!
                </>
              ) : (
                "Upload Avatar"
              )}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
export default memo(AvatarUpload);
