const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Fixed CORS configuration with proper URL format
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL, 
    "http://localhost:3000", 
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Add a root endpoint for testing
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/", (req, res) => {
  res.json({ message: "Post request received" });
});

// Your existing routes
app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use(`/item`, require(`./src/routes/item.route`));
app.use("/transaction", require("./src/routes/transaction.route"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});