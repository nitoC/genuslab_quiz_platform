"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  rounded?: boolean;
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const [imgSrc, setimgSrc] = useState<string | undefined>(props.src);
  return (
    <Image
      src={imgSrc || props.fallbackSrc || "/images/avatar.png"}
      alt={props.alt || "Image"}
      width={props.width || 40}
      height={props.height || 40}
      className={clsx(props.className, props.rounded && "rounded-full")}
      onError={() => setimgSrc(props.fallbackSrc || "/avatar.png")}
    />
  );
};

export default ImageWithFallback;
