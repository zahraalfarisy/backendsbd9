const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://os.netlabdte.com", 
    methods: "GET,POST,PUT,DELETE", 
  })
);

app.use(express.json());

app.use("/store", require("./src/routes/store.route"));
app.use("/user", require("./src/routes/user.route"));
app.use(`/item`, require(`./src/routes/item.route`));
app.use("/transaction", require("./src/routes/transaction.route"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});