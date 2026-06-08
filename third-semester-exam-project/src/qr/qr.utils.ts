import QRCode from "qrcode";

export const generateQRCodeImage = async (data: string) => {
  try {
    const qrImage = await QRCode.toDataURL(data);
    return qrImage;
  } catch (error) {
    throw new Error("QR generation failed");
  }
};