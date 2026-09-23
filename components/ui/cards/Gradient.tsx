const Gradient = ({
  heading,
  text,
  Icon,
  accent = "#3A94FF",
}: {
  heading: string;
  text: string;
  Icon?: any;
  accent?: string;
}) => {
  return (
    <div
      className="w-[300px] rounded-[18px] border border-gray-100 bg-white p-6 text-center shadow-sm transition-shadow duration-200 hover:shadow-md md:p-8"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      {Icon && (
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accent}1A` }}
        >
          {Icon}
        </div>
      )}
      <h3 className="text-xl font-bold mb-3 text-[#080820]">{heading}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {text}
        <a
          href="#"
          className="ml-1 whitespace-nowrap font-medium underline"
          style={{ color: accent }}
        >
          Learn more
        </a>
      </p>
    </div>
  );
};

export default Gradient;
