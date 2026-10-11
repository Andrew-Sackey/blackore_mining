"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getMedia, type MediaId } from "@/content/media";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";

function saveDataOn() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

export function Media({
  id,
  sizes = "100vw",
}: {
  id: MediaId;
  sizes?: string;
}) {
  const item = getMedia(id);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterOnly, setPosterOnly] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    if (item.kind !== "video" || !item.src) return;
    const reduced = document.documentElement.classList.contains("is-reduced");
    if (reduced || saveDataOn()) {
      // Browser signals are only available after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosterOnly(true);
    }
  }, [item.kind, item.src]);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video || !item.src || posterOnly) return;

    let loaded = false;
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || loaded) return;
        loaded = true;
        video.preload = "metadata";
        video.src = item.src ?? "";
        video.load();
      },
      { rootMargin: "100% 0px" },
    );
    const playObserver = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
    loadObserver.observe(root);
    playObserver.observe(root);
    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
      video.pause();
    };
  }, [item.src, posterOnly]);

  const showPlaceholder =
    !item.src || (broken && !item.poster) || (item.kind === "video" && posterOnly && !item.poster);

  return (
    <div className="media-fill" ref={rootRef} data-media={id}>
      {showPlaceholder ? (
        <MediaPlaceholder variant={item.placeholderVariant} shot={item.shot} animate={item.kind === "video"} />
      ) : item.kind === "image" && item.src ? (
        <Image src={item.src} alt={item.alt} fill sizes={sizes} />
      ) : (posterOnly || broken) && item.poster ? (
        <Image src={item.poster} alt={item.alt} fill sizes={sizes} />
      ) : (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={item.poster}
          aria-label={item.alt}
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}
