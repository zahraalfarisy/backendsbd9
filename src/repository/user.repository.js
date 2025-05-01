const db = require("../database/pg.database");

exports.getUserByEmail = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0]; 
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.getUserById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0]; 
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.createUser = async (user) => {
    try {
      const res = await db.query(
        "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *",
        [user.email, user.password, user.name]
      );
      return res.rows[0]; 
    } catch (error) {
      console.error("Error executing query", error);
    }
  };

exports.updateUser = async (id, email, password, name) => {
  try {
    const res = await db.query(
      "UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4 RETURNING *",
      [email, password, name, id]
    );
    return res.rows[0]; 
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.deleteUser = async (id) => {
  try {
    const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return res.rows[0]; 
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.updateUserBalance = async (id, newBalance) => {
  try {
    const res = await db.query(
      "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
      [newBalance, id]
    );
    return res.rows[0]; 
  } catch (error) {
    console.error("Error executing query", error);
  }
};