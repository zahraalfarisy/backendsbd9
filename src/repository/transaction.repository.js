const db = require("../database/pg.database");

exports.createTransaction = async (transaction) => {
    try {
        const userRes = await db.query("SELECT id FROM users WHERE id = $1", [transaction.user_id]);
        if (userRes.rows.length === 0) {
            throw new Error("User not found");
        }

        const itemRes  =  await db.query("SELECT * FROM items WHERE id = $1", [transaction.item_id]);
        if (itemRes.rows.length === 0) {
            throw new Error("Item not found");
        }

        const total =  itemRes.rows[0].price * transaction.quantity;

        const res = await db.query(
            "INSERT INTO transactions (item_id, quantity, user_id, total) VALUES ($1, $2, $3, $4) RETURNING *",
            [transaction.item_id, transaction.quantity, transaction.user_id, total]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
        throw error; 
    }
};

exports.getTransactions = async () => {
    try {
        const res = await db.query("SELECT id, item_id, quantity, user_id, total, status FROM transactions");
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.payTransaction = async (transactionId) => {
    try {
       
        const transactionRes = await db.query("SELECT * FROM transactions WHERE id = $1", [transactionId]);
        if (transactionRes.rows.length === 0) {
            throw new Error("Transaction not found");
        }
        const transaction = transactionRes.rows[0];

        
        const userRes = await db.query("SELECT balance FROM users WHERE id = $1", [transaction.user_id]);
        if (userRes.rows.length === 0) {
            throw new Error("User not found");
        }
        const userBalance = userRes.rows[0].balance;

       
        if (userBalance < transaction.total) {
            throw new Error("Not enough balance");
        }

       
        await db.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [transaction.total, transaction.user_id]);

        
        const res = await db.query(
            "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *",
            [transactionId]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

exports.deleteTransaction = async (transactionId) => {
    try {
        const res = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [transactionId]);
        if (!res || res.rows.length === 0) {
            throw new Error("Transaction not found");
        }
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};