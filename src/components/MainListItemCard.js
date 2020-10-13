import React, { useEffect, useState } from "react";
import "./MainListItemCard.css";
import axios from "axios";
import { Link } from "react-router-dom";
import store from "./Store";
import {dummy_img} from "./dummy_img";

function MainListItemCard({ id_pon }) {
  const [ponuda_slika, setPonuda_slika] = useState(dummy_img);
  const [ponuda_data, setPonuda_data] = useState({});

  const [user,setUser] = useState(store.getState().user);

  //postavi update stanja sa stora
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setUser(store.getState().user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fn = async () => {
      //podaci o ponudi
      const rows = await axios(
        "http://localhost:3003/api/get_item_by_id/" + id_pon.toString(),{withCredentials:true}
      );

      if (
        Object.keys(ponuda_data).length === 0 &&
        ponuda_data.constructor === Object
      ) {
        setPonuda_data(rows.data[0][0]);
      }

      //učitaj sliku
      let slika = await axios(
        "http://localhost:3003/api/get_item_default_image/" + id_pon.toString(),{withCredentials:true}
      );

      let bufferBase64 = "";

      if (slika.data.length > 0) {
        bufferBase64 = Buffer.from(slika.data[0].image.data).toString("base64");
      }

      setPonuda_slika(bufferBase64);
    };

    fn();
  }, [id_pon, ponuda_data]);

  function GetImageText() {
    let text =
      ponuda_data.brand +
      " " +
      ponuda_data.model +
      (ponuda_data.tip ? " " + ponuda_data.tip : "");

    return text;
  }

  return (
    <div className="main_list_item">
      <div className="photo_container">
        <p className="upper-left">Broj oglasa: {ponuda_data.brpon}</p>
        <img
          className="item_photo"
          alt=""
          src={"data:image/jpg;base64," + ponuda_slika}
        />
        <p className="bottom-left">{GetImageText()} </p>
      </div>
      {user.user_type === 2 ? (
        <div className="edit_btn">
          <Link to={"/edit_item/" + id_pon}>
            <i className="far fa-edit edit_link"></i>
          </Link>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default MainListItemCard;
