/**
 * Format a number as Tooman currency with Persian digits and thousand separators
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "۱,۴۹۹,۰۰۰ تومان")
 */
export function formatTooman(amount) {
  // Convert to number if string
  const num =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^\d]/g, ""))
      : amount;

  // Add thousand separators
  const formatted = num.toLocaleString("en-US");

  // Convert to Persian digits
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const persianFormatted = formatted.replace(
    /\d/g,
    (digit) => persianDigits[parseInt(digit)],
  );

  return `${persianFormatted} تومان`;
}
