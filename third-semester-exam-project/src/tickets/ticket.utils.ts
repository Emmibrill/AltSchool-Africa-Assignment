export const generateTicketNumber = () => {
  const prefix = "EVT";
  const random = Math.floor(100000 + Math.random() * 900000);
  const timestamp = Date.now().toString().slice(-4);

  return `${prefix}-${random}-${timestamp}`;
};