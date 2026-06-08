import express from "express";
import authRoutes from "./auth/auth.routes";
import eventRoutes from "./events/event.routes";
import cors from "cors";
import helmet from "helmet";
import ticketRoutes from "./tickets/ticket.routes";
import paymentRoutes from "./payments/payment.routes";
import qrRoutes from "./qr/qr.routes";
import attendanceRoutes from "./attendance/attendance.routes";




const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Eventful API Running");
});

export default app;