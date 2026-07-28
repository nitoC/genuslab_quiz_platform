"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageWithFallbackProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  rounded?: boolean;
}

const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackSrc,
  width = 40,
  height = 40,
  rounded,
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);

  // Update image whenever parent src changes
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      key={imgSrc}
      src={imgSrc || fallbackSrc || "https://placehold.net/avatar.svg"}
      alt={alt || "Image"}
      width={width}
      style={{ width: width, height: height }}
      height={height}
      className={clsx(className, rounded && "rounded-full")}
      onError={() => {
        setImgSrc(fallbackSrc || "/avatar.png");
      }}
    />
  );
};

export default ImageWithFallback;
