"use client";

import { PanInfo, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { FeedProps } from "./Feed.props";
import s from "./style.module.scss";
import { ImageCover } from "../ImageCover/ImageCover";
import { PathService } from "@/helpers/path";

export const Feed = ({
    images,
    imageCoverClassName,
    imgIdx,
    isImageLocale,
    setImgIdx
}: FeedProps)=> {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
		const container = containerRef.current;
		const el = itemsRef.current[imgIdx];

		if (!el) return;

		container?.scrollTo({
			behavior: "smooth",
			left: el.offsetLeft - container.offsetLeft
		});

		if (imgIdx === 0) {
			container!.scrollTo({ left: 0, behavior: 'smooth' });
			return;
		}

	}, [imgIdx]);

    const SWIPE_DISTANCE = 50;
    const SWIPE_VELOCITY = 500;
    const lastIdx = images.length - 1;

    const WHEEL_DISTANCE = 20;
    const wheelDeltaRef = useRef(0);
    const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const wheelLockedRef = useRef(false);

    const goNext = () => {
        setImgIdx((prev) => Math.min(prev + 1, lastIdx));
    }

    const goPrev = () => {
        setImgIdx((prev) => Math.max(prev - 1, 0));
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (wheelLockedRef.current) return;

        const delta = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;

        if (wheelTimeoutRef.current) {
            clearTimeout(wheelTimeoutRef.current);
        }

        wheelTimeoutRef.current = setTimeout(() => {
            wheelDeltaRef.current = 0;
        }, 120);

        if (Math.abs(wheelDeltaRef.current) < WHEEL_DISTANCE) return;
        
        if (e.deltaX > 0) {
            goNext();
        } else {
            goPrev();
        }

        wheelLockedRef.current = true;

        setTimeout(() => {
            wheelLockedRef.current = false;
        }, 500);
    };

    const handleSwipe = (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      const isSwipeLeft =
        info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY;

      const isSwipeRight =
        info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY;

      if (!setImgIdx 
          || imgIdx === undefined 
          || lastIdx === undefined
      ) return;

      if (isSwipeLeft) {
        goNext();
      }

      if (isSwipeRight) {
       goPrev();
      }
    };

    return (
        <motion.div 
            className={s.feed}
            ref={containerRef}
            onPanEnd={handleSwipe}
            onWheelCapture={handleWheel}
        >
            {images.map((img, idx) => (
                <ImageCover
                    key={idx}
                    className={imageCoverClassName}
                    ref={(el) => {
                        itemsRef.current[idx] = el;
                    }}
                    url={
                        isImageLocale
                            ? PathService.withBasePath(img.url)
                            : img.url
                        || "/empty_room.jpg"}
                />
            ))}
        </motion.div>
    )
}
