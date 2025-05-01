const express = require("express");
const transactionController = require("../controllers/transaction.controller");

const router = express.Router();

// Route to create a new transaction
router.post("/create", transactionController.createTransaction);

// Route to pay for a transaction (status change to 'paid')
router.post("/pay/:id", transactionController.payTransaction);

router.get("/", transactionController.getTransactions);

// Route to delete a transaction
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
