const Gradient = ({
  heading,
  text,
  Icon,
  active,
}: {
  heading: string;
  text: string;
  Icon?: any;
  active?: boolean;
}) => {
  return (
    <div
      className={`bg-gradient-to-r w-[300px] from-purple-400 via-pink-500 to-blue-500 p-[2px] rounded-[20px] shadow-lg ${
        active ? "md:scale-120 z-10" : ""
      }`}
    >
      <div className="bg-[#E6FAF9] rounded-[18px] p-6 md:p-8 text-center h-full">
        <div className="flex justify-center mb-4">
          {/* Replace with actual icon if available */}
          {Icon}
          {/* <span className="text-xl">👥</span> */}
        </div>
        <h3 className="text-xl font-black mb-3 text-black">{heading}</h3>
        <p className="text-sm text-gray-800 leading-relaxed">
          {text}
          <a
            href="#"
            className="text-blue-600 font-medium ml-1 underline whitespace-nowrap"
          >
            Learn more
          </a>
        </p>
      </div>
    </div>
  );
};

export default Gradient;
