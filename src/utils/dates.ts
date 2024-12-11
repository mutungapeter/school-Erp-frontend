
import dayjs from "dayjs";

/**
 * Formats a given date to "YYYY-MM-DD"
 * @param date - The date to format
 * @returns The formatted date string
 */
export const formattDate = (date: Date): string => {
  if (!date) return ""; 
  return dayjs(date).format("YYYY-MM-DD");
};

/**
 * Returns the ordinal suffix of a given number
 * @param n - The number to get the ordinal suffix for
 * @returns The ordinal suffix
 */
const getOrdinalSuffix = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

/**
 * Formats a given date to "D[st|nd|rd|th] MMMM YYYY"
 * @param date - The date to format
 * @returns The formatted date string
 */
export const formatDetailedDate = (date: Date): string => {
  if (!date) return ""; 
  const day = dayjs(date).date();
  const suffix = getOrdinalSuffix(day);
  return dayjs(date).format(`D[${suffix}] MMMM YYYY`);
};

export const formattedDate = (date: Date): string => {
    if (!date) return "";
    return dayjs(date).format("DD-MM-YYYY");
    // return dayjs(date).format("YYYY-MM-DD");
  };

  export const formatYear = (date: Date): string => {
    if (!date) return "";
    return dayjs(date).format("YYYY");
  };