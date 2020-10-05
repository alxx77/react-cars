import mysql from "./sql_utils.mjs";

async function getUserByEmail(email) {
    const connection = await mysql.connection();
    try {
      const user_rows = await connection.query(`SELECT * from users where email=?`, [
        email,
      ]);
  
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
      const user_rows = await connection.query(`SELECT * from users where user_id=?`, [
        id,
      ]);
  
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


  export {getUserByEmail,getUserById};