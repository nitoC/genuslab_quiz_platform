import { toast } from "react-toastify";

export const formatDate = (dateString: string): string | undefined => {
  const dateParts = dateString.split("/");
  if (dateParts.length !== 3) {
    toast.warn("Invalid date format. Expected YYYY/MM/DD.");
    return;
  }
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const date = new Date(
    Number(dateParts[2]),
    Number(dateParts[1]) - 1,
    Number(dateParts[0])
  );
  //   console.log(date, "formatted date");
  //   console.log(date.toLocaleDateString("en-US", options), "formatted date");
  //   console.log(Number(dateParts[2]), "year");
  //   console.log(Number(dateParts[0]) - 1, "month");
  //   console.log(Number(dateParts[1]), "day");
  return date.toLocaleDateString("en-US", options);
};
