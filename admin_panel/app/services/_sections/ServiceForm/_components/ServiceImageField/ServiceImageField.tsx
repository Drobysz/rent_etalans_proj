"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import styles from "./style.module.scss";
import type { ServiceImageFieldProps } from "./ServiceImageField.props";
import type { ServiceImage } from "@/interfaces";

type ImagePreview = {
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
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const setSelectedImages = (files: File[]) => {
    setPreviews((current) => {
      current.forEach((preview) => URL.revokeObjectURL(preview.url));

      return files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
    });
  };

  const updateInputFiles = (files: File[]) => {
    if (!inputRef.current) {
      return;
    }

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    inputRef.current.files = dataTransfer.files;
  };

  const clearSelectedImages = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setSelectedImages([]);
  };

  const removeSelectedImage = (index: number) => {
    const selectedFiles = Array.from(inputRef.current?.files ?? []);
    const nextFiles = selectedFiles.filter((_, fileIndex) => fileIndex !== index);

    if (nextFiles.length === 0) {
      clearSelectedImages();
      return;
    }

    updateInputFiles(nextFiles);
    setSelectedImages(nextFiles);
  };

  const applyFiles = (files: FileList | File[]) => {
    const images = Array.from(files).filter((item) => item.type.startsWith("image/"));

    if (images.length === 0) {
      return;
    }

    updateInputFiles(images);
    setSelectedImages(images);
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

  const removeExistingImage = (image: ServiceImage) => {
    setCurrentImages((images) => images.filter((item) => item.id !== image.id));
    setRemovedImageIds((ids) => [...ids, image.id]);
  };

  const requiresImage = required && previews.length === 0 && currentImages.length === 0;

  return (
    <div className={styles.field}>
      <span>Images</span>
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
          Choisir des images
          <input
            ref={inputRef}
            name="images"
            type="file"
            accept="image/*"
            multiple
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
            aria-label={`Supprimer l'image : ${image.filename}`}
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
        {previews.map((preview, index) => (
          <button
            key={`${preview.name}-${preview.url}`}
            className={styles.previewButton}
            type="button"
            onClick={() => removeSelectedImage(index)}
            aria-label={`Supprimer l'image sélectionnée : ${preview.name}`}
          >
            <span
              className={styles.preview}
              style={{ backgroundImage: `url("${preview.url}")` }}
              title={preview.name}
              aria-hidden="true"
            />
            <span className={styles.removeIcon} aria-hidden="true">
              <span className={styles.removeIconInner}>×</span>
            </span>
          </button>
        ))}
      </span>
      {error ? <strong>{error}</strong> : null}
    </div>
  );
}
