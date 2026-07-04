"use client";

import { forwardRef } from 'react';
import Image from "next/image";
import cn from "classnames";
import s from "./style.module.scss";
import { PathService } from '@/helpers/path';

interface ImageCoverProps{
  url: string;
  className?: string;
}

export const ImageCover = forwardRef<HTMLDivElement, ImageCoverProps>(
  ({ url, className, ...props }, ref) => {
    
    return (
      <div
        ref={ref}
        className={cn(s.image_cover, className)}
        {...props}
      >
        <Image
          src={PathService.withBasePath(url)}
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 100vw, 306px"
          unoptimized
        />
      </div>
    );
  }
);

ImageCover.displayName = 'ImageCover';
