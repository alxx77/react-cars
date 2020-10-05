import mysql from "./sql_utils.mjs";
import fs from "fs/promises";
import Jimp from "jimp";

//osnovni podaci o ponudi
const getItemById = async (req, res) => {
  const connection = await mysql.connection();
  try {
    const ponuda = await connection.query("call GetPonuda(?)", [
      req.params.id_pon,
    ]);

    res.send(ponuda);
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

//lista svih ponuda
const getItems = async (req, res) => {
  const connection = await mysql.connection();
  try {
    const ponude = await connection.query(
      "SELECT id_pon from ponude where (dat_zatv is null)",
      []
    );

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

//naslovna slika oglasa
const getItemDefaultImage = async (req, res) => {
  const connection = await mysql.connection();
  try {
    const slika = await connection.query(
      "SELECT * from slike where (id_pon=?) order by img_num asc limit 1",
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

const writeItem = async (req, res, formData) => {
  const connection = await mysql.connection();
  try {
    //proveri sve parametre
    let files = Object.keys(formData.files);

    //započni transakciju
    await connection.query("START TRANSACTION");

    let r = null;

    let id_pon = Number.parseInt(formData.fields.id_pon);

    //insert
    if (id_pon === -1) {
      r = await connection.query(
        `Call InsertPonuda(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
        [
          Number.parseInt(formData.fields.id_brand),
          Number.parseInt(formData.fields.id_model),
          formData.fields.tip,
          formData.fields.vat_ddct === "false" ? false : true,
          Number.parseFloat(formData.fields.neto_cena_val),
          Number.parseFloat(formData.fields.pdv_cena_val),
          Number.parseFloat(formData.fields.bruto_cena_val),
          formData.fields.opis,
          formData.fields.dat_pon,
          Number.parseInt(formData.fields.god_proizv),
          Number.isNaN(Number.parseFloat(formData.fields.real_bruto_cena_val))
            ? null
            : Number.parseFloat(formData.fields.real_bruto_cena_val),
          formData.fields.a000_karoserija === ""
            ? null
            : formData.fields.a000_karoserija,
          formData.fields.a001_broj_vrata === ""
            ? null
            : formData.fields.a001_broj_vrata,
          formData.fields.a002_tip_goriva === ""
            ? null
            : formData.fields.a002_tip_goriva,
          formData.fields.a003_polovno === ""
            ? null
            : formData.fields.a003_polovno,
          formData.fields.a004_ccm === "" ? null : formData.fields.a004_ccm,
          formData.fields.a005_kw === "" ? null : formData.fields.a005_kw,
          formData.fields.a006_km === "" ? null : formData.fields.a006_km,
        ]
      );

      id_pon = [r[0][0].id];
    } else {
      //edit
      r = await connection.query(
        `CALL ivbsol_prod.UpdatePonuda(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          id_pon,
          Number.parseInt(formData.fields.id_brand),
          Number.parseInt(formData.fields.id_model),
          formData.fields.tip,
          formData.fields.vat_ddct === "false" ? false : true,
          Number.parseFloat(formData.fields.neto_cena_val),
          Number.parseFloat(formData.fields.pdv_cena_val),
          Number.parseFloat(formData.fields.bruto_cena_val),
          formData.fields.opis,
          formData.fields.dat_pon,
          Number.parseInt(formData.fields.god_proizv),
          Number.isNaN(Number.parseFloat(formData.fields.real_bruto_cena_val))
            ? null
            : Number.parseFloat(formData.fields.real_bruto_cena_val),
          formData.fields.a000_karoserija === ""
            ? null
            : formData.fields.a000_karoserija,
          formData.fields.a001_broj_vrata === ""
            ? null
            : formData.fields.a001_broj_vrata,
          formData.fields.a002_tip_goriva === ""
            ? null
            : formData.fields.a002_tip_goriva,
          formData.fields.a003_polovno === ""
            ? null
            : formData.fields.a003_polovno,
          formData.fields.a004_ccm === "" ? null : formData.fields.a004_ccm,
          formData.fields.a005_kw === "" ? null : formData.fields.a005_kw,
          formData.fields.a006_km === "" ? null : formData.fields.a006_km,
          null,
          null,
        ]
      );
    }

    //obriši stare slike
    await connection.query(
      `Delete from slike where id_pon=?`,
      id_pon
    );

    files.forEach(async (el) => {
      if (formData.files[el].size > 10000000) {
        throw new Error("Image size too large...!");
      }

      let img_height = 0;
      let img_width = 0;
      let mime = "";

      let img = await Jimp.read(formData.files[el].path);

      img_height = img.bitmap.height;
      img_width = img.bitmap.width;
      mime = img.getMIME();

      let blob = await fs.readFile(formData.files[el].path);

      await connection.query(
        `INSERT INTO slike (id_pon, img_num, image_type, image, image_height, image_width, image_thumb, thumb_height, thumb_width, image_name, dat_ent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,NOW())`,
        [
          id_pon,
          el.slice(4),
          mime,
          blob,
          img_height,
          img_width,
          null,
          null,
          null,
          formData.files[el].name,
        ]
      );
    });

    await connection.query("COMMIT");

    res.send({ success: true, error: null });
  } catch (err) {
    await connection.query("ROLLBACK");
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

export { getItemById, getItems, getItemDefaultImage, writeItem };
