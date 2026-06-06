"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, DragEvent } from "react";
import styles from "./style.module.scss";
import type { ServiceImageFieldProps } from "./ServiceImageField.props";

export function ServiceImageField({ error }: ServiceImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ name: string; url: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview]);

  const setSelectedImage = (file: File | null) => {
    setPreview((current) => {
      if (current?.url) {
        URL.revokeObjectURL(current.url);
      }

      if (!file) {
        return null;
      }

      return {
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

  const previewStyle: CSSProperties | undefined = preview
    ? { backgroundImage: `url("${preview.url}")` }
    : undefined;

  return (
    <label className={styles.field}>
      <span>Image</span>
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
            aria-invalid={Boolean(error)}
            onChange={handleFileChange}
          />
        </span>
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
    </label>
  );
}
