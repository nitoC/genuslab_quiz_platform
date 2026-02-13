import React from "react";

const BellIcon = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M29.9453 4.28613C31.8738 4.28613 33.4311 5.84326 33.4311 7.77183V11.2576H26.4453V7.77183C26.4596 5.84326 28.0168 4.28613 29.9453 4.28613Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M29.9429 4.28613C29.6429 4.28613 29.3717 4.32898 29.0859 4.38613C30.6002 4.77183 31.7287 6.14326 31.7287 7.77183V11.2576H33.4287V7.77183C33.4429 5.84326 31.8717 4.28613 29.9429 4.28613Z"
      fill="url(#paint1_radial)"
    />
    <path
      d="M52.4748 45.8995C52.5463 43.5708 50.9463 41.7708 48.1605 38.5138C45.3748 35.2565 45.089 35.0565 44.232 23.928C43.4748 14.1566 39.1605 10.9709 33.9748 9.37088C32.6748 8.97088 31.3175 8.78516 29.9605 8.78516C28.6033 8.78516 27.2463 8.97088 25.9463 9.37088C20.7462 10.9852 16.4462 14.1709 15.6891 23.9423C14.8319 35.0708 14.5319 35.2565 11.7605 38.528C8.98909 41.7995 7.36052 43.5708 7.43194 45.8995H52.4748Z"
      fill="url(#paint2_radial)"
    />
    {/* Continue adding remaining <path> elements the same way */}

    {/* Gradient Definitions */}
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="35.2586"
        y1="15.4017"
        x2="23.7488"
        y2="1.30233"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#A3541E" />
        <stop offset="0.5525" stopColor="#FCCE38" />
        <stop offset="0.9996" stopColor="#FF9D00" />
      </linearGradient>
      <radialGradient
        id="paint1_radial"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(28.8704 8.45278) scale(5.38095 5.38095)"
      >
        <stop offset="0.4543" stopColor="#C86F34" stopOpacity="0" />
        <stop offset="0.6679" stopColor="#C66D33" stopOpacity="0.4456" />
        <stop offset="0.7838" stopColor="#BE672E" stopOpacity="0.6874" />
        <stop offset="0.876" stopColor="#B05E26" stopOpacity="0.8797" />
        <stop offset="0.9336" stopColor="#A3541E" />
      </radialGradient>
      <radialGradient
        id="paint2_radial"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(24.8718 17.5469) rotate(99.5904) scale(36.6755 26.8558)"
      >
        <stop stopColor="#FCCE38" />
        <stop offset="0.3638" stopColor="#FCCE38" />
        <stop offset="1" stopColor="#C86F34" />
      </radialGradient>
      {/* Continue adding all remaining gradients the same way, and ensure all IDs are unique or scoped if needed */}
    </defs>
  </svg>
);

export default BellIcon;
