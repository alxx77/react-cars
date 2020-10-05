import mysql from "./sql_utils.mjs";

//brendovi
const getBrandList = async (req, res) => {
    const connection = await mysql.connection();
    try {
      const ponude = await connection.query("SELECT * from brands", []);
  
      res.send(ponude);
    } catch (err) {
      res.send(
        JSON.stringify({
          success: false,
          error: err.toString(),
        })
      );
    } finally {
      await connection.release();
    }
  };

  export {getBrandList};