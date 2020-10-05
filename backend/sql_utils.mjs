import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();


let dbConfig = {
  connectionLimit: 10, // default 10
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};


//novi pool
const pool = mysql.createPool(dbConfig);

//konekcija
const connection = () => {
  //
  return new Promise((resolve, reject) => {
    //nova konekcija iz poola
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      //console.log("MySQL pool connected: threadId " + connection.threadId);
      //upit
      const query = (sql, binding) => {
        //
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) reject(err);
            resolve(result);
          });
        });
      };
      //oslobađanje konekcije
      const release = () => {
        return new Promise((resolve, reject) => {
          if (err) reject(err);
          //console.log("MySQL pool released: threadId " + connection.threadId);
          resolve(connection.release());
        });
      };

      //razrešavanje promisa
      resolve({ query, release });
    });
  });
};

//upit
const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export default  {pool, connection, query};
