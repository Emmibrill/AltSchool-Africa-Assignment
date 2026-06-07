import express from "express";
import authRoutes from "./auth/auth.routes";
import eventRoutes from "./events/event.routes";
import cors from "cors";
import helmet from "helmet";
import ticketRoutes from "./tickets/ticket.routes";




const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Eventful API Running");
});

export default app;