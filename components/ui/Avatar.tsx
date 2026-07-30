"use client";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import ImageWithFallback from "./ImageWithFallback";

const Avatar = ({
  size,
  type,
  color,
  url,
  alt,
}: {
  size: number;
  type: string;
  color?: string;
  url?: string;
  alt?: string;
}) => {
  const variant = {
    main: "border border-2",
    explore: "rounded-lg",
  };

  return (
    <div>
      <ImageWithFallback
        src={url}
        width={size}
        height={size}
        rounded={true}
        className={clsx(
          variant[type as keyof typeof variant],
          color && color,
          "object-cover",
        )}
        alt={alt}
      />
    </div>
  );
};

export default Avatar;
