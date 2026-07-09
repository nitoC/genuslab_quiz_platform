import clsx from "clsx";
import Link from "next/link";

const Primary = ({
  style,
  text,
  handler,
  to,
  type,
}: {
  style?: string;
  text: string;
  type?: string;
  to?: string;
  handler?: () => void;
}) => {
  if (type === "link" && to) {
    return (
      <Link
        href={to}
        className={clsx(
          "py-2 px-6 cursor-pointer text-center inline-block",
          style ? style : "bg-blue text-white rounded-sm",
        )}
      >
        {text}
      </Link>
    );
  }
  return (
    <button
      onClick={handler}
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
