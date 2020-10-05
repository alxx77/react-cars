import mysql from "./sql_utils.mjs";

//modeli za brend
const getModelListByBrand = async (req, res) => {
    const connection = await mysql.connection();
    try {
      const ponude = await connection.query("SELECT * from models where id_brand=?", [req.params.id_brand]);
  
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


  export {getModelListByBrand};