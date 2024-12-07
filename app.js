require("dotenv").config();
const express = require("express");
const http = require("http"); // Import http for the server
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/usersRoutes");
const cartRoutes = require("./routes/cartRoutes");
const specialPackagesRoutes = require("./routes/specialPackagesRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: ["https://edstelar-inventory.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

app.use(express.json());
connectDB();

const allowedOrigins = [
  "https://edstelar-inventory.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Define routes
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/special", specialPackagesRoutes);
app.use("/api/cart", cartRoutes);

app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", ({ userId }) => {
    socket.join(userId);
    console.log(`User with ID ${userId} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.set("socketio", io);

module.exports = server;
