import truncate from "lodash/truncate";

export function excerpt(string) {
  return truncate(string, {
    length: 400, // maximum 400 characters
    separator: /,?\.* +/, // separate by spaces, including preceding commas and periods
  });
}

export function dateFormatter(string) {
  const date = new Date(string);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
