import clsx from "clsx";

const Primary = ({
  style,
  text,
  handler,
}: {
  style?: string;
  text: string;
  handler?: () => void;
}) => {
  return (
    <button
      className={clsx(
        "py-2 px-6 cursor-pointer",
        style ? style : "bg-blue text-white rounded-sm",
      )}
    >
      {text}
    </button>
  );
};

export default Primary;
