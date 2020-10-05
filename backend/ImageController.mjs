import mysql from "./sql_utils.mjs";


//naslovna slika oglasa
const getImage = async (req, res) => {
  const connection = await mysql.connection();
  try {
    console.log("at querySignUp...");

    const slika = await connection.query(
      "SELECT * from slike where (image_id=?)",
      [req.params.image_id]
    );

    res.send(slika);
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

//naslovna slika oglasa
const getAllImagesForItem = async (req, res) => {
  const connection = await mysql.connection();
  try {
    //console.log("at querySignUp...");

    const slika = await connection.query(
      "SELECT * from slike where (id_pon=?)",
      [req.params.id_pon]
    );

    res.send(slika);
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


export {getImage,getAllImagesForItem};