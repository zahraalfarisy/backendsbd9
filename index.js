const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Fixed CORS configuration with proper URL format and without trailing slashes
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL, 
    "http://localhost:3000", 
    "http://localhost:5173",
    "https://cs-sbd9-zhafira.vercel.app" // Removed trailing slash
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware before defining routes
app.use(cors(corsOptions));
app.use(express.json());

// Add a simple middleware to manually set CORS headers for all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://cs-sbd9-zhafira.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).send();
  }
  next();
});

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