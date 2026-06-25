import React from "react";

const AdminTextArea = ({
  placeholder,
  h,
  value,
  handler,
}: {
  placeholder: string;
  h: string;
  value: string;
  handler: (value: string) => void;
}) => {
  return (
    <div className="relative border overflow-hidden border-[#E2E8F0] rounded bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
      <textarea
        rows={3}
        placeholder={placeholder}
        className={`w-full px-4 pt-3 pb-12 rounded resize-y outline-none text-gray-700 placeholder-gray-400 bg-transparent min-h-${h}`}
        value={value}
        onChange={(e) => handler(e.target.value)}
      />
      {/* Form Toolbar Utility */}
    </div>
  );
};

export default AdminTextArea;
