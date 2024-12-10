const now = new Date();
const formattedDate = now.toLocaleString("en-US", {
  weekday: "long", // e.g., "Monday"
  year: "numeric", // e.g., "2024"
  month: "long", // e.g., "December"
  day: "numeric", // e.g., "9"
  hour: "numeric", // e.g., "10"
  minute: "numeric", // e.g., "30"
  second: "numeric", // e.g., "45"
  hour12: true, // 12-hour format
});

export { formattedDate };
