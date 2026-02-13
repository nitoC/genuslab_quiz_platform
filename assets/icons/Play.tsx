import React from "react";

const Play = ({ width }: { width: number }) => {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 201 201"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2199_8411)">
        <circle cx="98.5" cy="80.5" r="40" fill="white" />
      </g>
      <path
        d="M113.075 80.3097C113.721 80.6983 113.721 81.635 113.075 82.0236L92.0154 94.6891C91.3489 95.0899 90.5 94.6099 90.5 93.8321L90.5 68.5012C90.5 67.7235 91.3489 67.2434 92.0154 67.6443L113.075 80.3097Z"
        fill="#3A94FF"
      />
      <defs>
        <filter
          id="filter0_d_2199_8411"
          x="0.5"
          y="0.5"
          width="200"
          height="200"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="20" />
          <feGaussianBlur stdDeviation="30" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.239854 0 0 0 0 0.607896 0 0 0 0 0.725 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2199_8411"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2199_8411"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Play;
