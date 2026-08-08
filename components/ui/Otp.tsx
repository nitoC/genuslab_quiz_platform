"use client";
import { useState } from "react";
import OtpInput from "react-otp-input";

export default function OtpInputWrapper({
  otp,
  setOtp,
}: {
  otp: string;
  setOtp: (val: string) => void;
}) {
  // const [otp, setOtp] = useState("");

  return (
    <OtpInput
      value={otp}
      onChange={setOtp}
      numInputs={4}
      inputStyle={{
        width: 60,
        height: 60,
        border: "1px solid grey",
        borderRadius: "8px",
      }}
      renderSeparator={<span> - </span>}
      renderInput={(props) => <input {...props} />}
    />
  );
}
