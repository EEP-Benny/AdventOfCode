import { readFileSync } from "fs";

const defaultYear = 2019; // for legacy reasons

const normalizeNewlines = (str: string) => str.replace(/\r\n/g, "\n");

export function formatFilename(day: number, year: number, suffix = "") {
  return `./${year}/${String(day).padStart(2, "0")}${suffix}`;
}
export function getInput(day: number, year = defaultYear) {
  return normalizeNewlines(
    readFileSync(formatFilename(day, year, ".input.txt"), "utf8")
  );
}
export function getInputArray({ day, year = defaultYear, separator }) {
  const text = getInput(day, year);
  const arr = text.split(separator);
  return arr.filter((s: string) => s !== ""); //filters out empty elements
}
export function getProgram({ day, year = defaultYear }) {
  return getInputArray({ day, year, separator: "," }).map((s: string) =>
    parseInt(s, 10)
  );
}
