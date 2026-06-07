"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, DragEvent } from "react";
import styles from "./style.module.scss";
import type { ServiceImageFieldProps } from "./ServiceImageField.props";
import type { ServiceImage } from "@/interfaces";

type ImagePreview = {
  isObjectUrl: boolean;
  name: string;
  url: string;
};

export function ServiceImageField({
  error,
  existingImages = [],
  required = false,
}: ServiceImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentImages, setCurrentImages] = useState<ServiceImage[]>(existingImages);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [preview, setPreview] = useState<ImagePreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.isObjectUrl) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview]);

  const setSelectedImage = (file: File | null) => {
    setPreview((current) => {
      if (current?.isObjectUrl) {
        URL.revokeObjectURL(current.url);
      }

      if (!file) {
        return null;
      }

      return {
        isObjectUrl: true,
        name: file.name,
        url: URL.createObjectURL(file),
      };
    });
  };

  const applyFiles = (files: FileList | File[]) => {
    const file = Array.from(files).find((item) => item.type.startsWith("image/"));

    if (!file || !inputRef.current) {
      return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputRef.current.files = dataTransfer.files;
    setSelectedImage(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    applyFiles(event.target.files ?? []);
  };

  const handleDragOver = (event: DragEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event: DragEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setIsDragging(false);
    applyFiles(event.dataTransfer.files);
  };

  const clearSelectedImage = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setSelectedImage(null);
  };

  const removeExistingImage = (image: ServiceImage) => {
    setCurrentImages((images) => images.filter((item) => item.id !== image.id));
    setRemovedImageIds((ids) => [...ids, image.id]);
  };

  const previewStyle: CSSProperties | undefined = preview
    ? { backgroundImage: `url("${preview.url}")` }
    : undefined;
  const requiresImage = required && !preview && currentImages.length === 0;

  return (
    <div className={styles.field}>
      <span>Image</span>
      {removedImageIds.map((imageId) => (
        <input key={imageId} type="hidden" name="deleteImageIds" value={imageId} />
      ))}
      <span className={styles.fileControl}>
        <span
          className={cn(styles.fileButton, isDragging && styles.dragging)}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          Choose image
          <input
            ref={inputRef}
            name="images"
            type="file"
            accept="image/*"
            required={requiresImage}
            aria-invalid={Boolean(error)}
            onChange={handleFileChange}
          />
        </span>
        {currentImages.map((image) => (
          <button
            key={image.id}
            className={styles.previewButton}
            type="button"
            onClick={() => removeExistingImage(image)}
            aria-label={`Remove image: ${image.filename}`}
          >
            <span
              className={styles.preview}
              style={{ backgroundImage: `url("${image.url}")` }}
              title={image.filename}
              aria-hidden="true"
            />
            <span className={styles.removeIcon} aria-hidden="true">
              <span className={styles.removeIconInner}>×</span>
            </span>
          </button>
        ))}
        {preview ? (
          <button
            className={styles.previewButton}
            type="button"
            onClick={clearSelectedImage}
            aria-label={`Remove selected image: ${preview.name}`}
          >
            <span
              className={styles.preview}
              style={previewStyle}
              title={preview.name}
              aria-hidden="true"
            />
            <span className={styles.removeIcon} aria-hidden="true">
              <span className={styles.removeIconInner}>×</span>
            </span>
          </button>
        ) : null}
      </span>
      {error ? <strong>{error}</strong> : null}
    </div>
  );
}
