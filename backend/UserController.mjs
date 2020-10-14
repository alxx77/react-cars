import mysql from "./sql_utils.mjs";
import * as Crypto from "crypto";

async function getUserByEmail(email) {
  const connection = await mysql.connection();
  try {
    const user_rows = await connection.query(
      `SELECT * from users where email=?`,
      [email]
    );

    //da li korisnik postoji
    if (user_rows.length < 1) {
      return null;
    }

    return user_rows[0];
  } catch (err) {
    return null;
  } finally {
    await connection.release();
  }
}

async function getUserById(id) {
  const connection = await mysql.connection();
  try {
    const user_rows = await connection.query(
      `SELECT * from users where user_id=?`,
      [id]
    );

    //da li korisnik postoji
    if (user_rows.length < 1) {
      return null;
    }

    return user_rows[0];
  } catch (err) {
    return null;
  } finally {
    await connection.release();
  }
}

async function registerUser(req, res) {
  const connection = await mysql.connection();
  try {
    //započni transakciju
    await connection.query("START TRANSACTION");

    //proveri da li korisnik postoji
    const user_rows = await connection.query(
      `SELECT * from users where email=?`,
      [req.query.email]
    );

    //da li korisnik postoji
    if (user_rows.length < 1) {
      //ako ne upiši

      const hash = Crypto.createHash("md5");

      const pwdsalt = Crypto.randomBytes(16).toString("base64");

      hash.update(req.query.password + pwdsalt);

      const pwdhash = hash.digest("hex");

      const inserted = await connection.query(
        `INSERT INTO users
        (username, email, pwdhash, user_type, pwdsalt, active)
        VALUES(?, ?, ?, ?, ?, ?);`,
        [req.query.email, req.query.email, pwdhash, 1, pwdsalt, 1]
      );

      //console.log(inserted);

      await connection.query("COMMIT");

      res.send({
        success: true,
        affectedRows: inserted.affectedRows,
        error: null,
      });
    } else {
      await connection.query("ROLLBACK");
      res.send({ success: false, error: "Email already exists...!"});

    }
  } catch (err) {
    await connection.query("ROLLBACK");
    res.send({ success: false, error: err.toString() });
  } finally {
    await connection.release();
  }
}

export { getUserByEmail, getUserById, registerUser };
