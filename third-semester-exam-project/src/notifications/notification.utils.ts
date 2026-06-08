export const calculateReminderTime = (eventDate: Date, type: "1h" | "1d" | "1w") => {
  const date = new Date(eventDate);

  if (type === "1h") date.setHours(date.getHours() - 1);
  if (type === "1d") date.setDate(date.getDate() - 1);
  if (type === "1w") date.setDate(date.getDate() - 7);

  return date;
};