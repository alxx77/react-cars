import "./UpsertItem.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import UpsertFormItemPhoto from "./components/UpsertFormItemPhoto";
import { v4 as uuidv4 } from "uuid";
import * as base64fns from "./helper_fns";
import { setData } from "./components/actions";
import store from "./components/Store";
import { useParams,useLocation,useHistory} from "react-router-dom";

function UpsertItem() {
  let fileReader;

  const history=useHistory();

  //id ponude
  let id_pon = Number.parseInt(useParams().id_pon);

  //da li je edit ili novi
  const edit_mode = useLocation().pathname.includes("edit_item");

  let prazna_ponuda = {
    bruto_cena_val: 0,
    brpon: "00000",
  };

  const sqlDateTime = function (d) {
    return d.toISOString().split("T")[0] + " " + d.toTimeString().split(" ")[0];
  };

  const [ponuda_data, setPonuda_data] = useState(prazna_ponuda);

  const [input_bruto_cena_val, setInput_bruto_cena_val] = useState(0);
  const [input_tip, setInput_tip] = useState("");
  const [input_opis, setInput_opis] = useState("");
  const [input_dat_pon, setInput_dat_pon] = useState(
    sqlDateTime(new Date(Date.now())).slice(0, 10)
  );
  const [input_god_proizv, setInput_god_proizv] = useState(
    new Date(Date.now()).getFullYear().toString()
  );

  const [brand_lista, setBrand_lista] = useState([]);
  const [brand_selection_value, setBrand_selection_value] = useState(1);

  const [model_lista, setModel_lista] = useState([]);
  const [model_selection_value, setModel_selection_value] = useState(1);

  const [ponuda_slike, setPonuda_slike] = useState([]);

  //operacije potrebne u svakom slučaju - i ako je edit mode ili ako je dodavanje novog elementa
  useEffect(() => {
    const fn = async () => {
      const brand_lista_rows = await axios(
        "http://localhost:3003/api/get_brand_list"
      );

      setBrand_lista(brand_lista_rows.data);

      //lista modela
      const model_lista_rows = await axios(
        "http://localhost:3003/api/get_model_list_by_brand/" +
          brand_selection_value
      );

      setModel_lista(model_lista_rows.data);
    };

    fn();
  }, [brand_selection_value]);

  //ako je izmena
  //moraju se postaviti vrednosti postojeće ponude
  useEffect(() => {
    const fn = async () => {
      //podaci o ponudi
      const ponuda_data_rows = await axios(
        "http://localhost:3003/api/get_item_by_id/" + id_pon
      );

      const ponuda = ponuda_data_rows.data[0][0];

      setPonuda_data(ponuda);

      setInput_bruto_cena_val(ponuda.bruto_cena_val);
      setInput_tip(ponuda.tip ?? "");
      setInput_opis(ponuda.opis ?? "");
      setInput_god_proizv(ponuda.god_proizv ?? "");

      const d = sqlDateTime(new Date(ponuda.dat_pon)).slice(0, 10);

      setInput_dat_pon(d ?? "");

      setBrand_selection_value(ponuda.id_brand);
      setModel_selection_value(ponuda.id_model);

      //učitaj sve slike za ponudu
      const slike_data_rows = await axios(
        "http://localhost:3003/api/get_items_images/" + id_pon
      );

      let images = [];

      slike_data_rows.data.forEach((el) => {
        let s = Buffer.from(el.image.data).toString("base64");

        el.image = null;

        let img = { ...el, base64ImageData: s, uuid: uuidv4() };

        images.push(img);
      });

      setPonuda_slike(images);
    };

    if (edit_mode) {
      fn();
    }
  }, [id_pon, edit_mode]);


  //postavljanje modela za trenutno selektovani brend
  async function BrandSelectionValueChangedHandler(e) {
    setBrand_selection_value(e.target.value);

    //postavi model za brend

    //lista modela
    const model_lista_rows = await axios(
      "http://localhost:3003/api/get_model_list_by_brand/" + e.target.value
    );

    setModel_lista(model_lista_rows.data);

    setModel_selection_value(ponuda_data.id_model);
  }

  //ukloni sliku
  function removeItemPhoto(uuid) {
    setPonuda_slike(
      ponuda_slike.reduce((pv, el) => {
        if (el.uuid !== uuid) {
          pv.push(el);
        }
        return pv;
      }, [])
    );
  }

  const handleFileRead = (e) => {
    const content = fileReader.result;

    //podela dataURL na delove
    let block = content.split(";");

    //tip sadržaja
    //let contentType = block[0].split(":")[1];

    //podaci base64string
    let realData = block[1].split(",")[1];

    let img = { uuid: uuidv4() };

    //novi image objekat
    let new_img = new Image();

    new_img.onload = (event) => {
      let canvas = document.createElement("canvas");

      let w = 800;

      let f = new_img.naturalWidth / 800;

      let h = new_img.naturalHeight / f;

      canvas.width = w;
      canvas.height = h;

      let ctx = canvas.getContext("2d");

      ctx.drawImage(new_img, 0, 0, w, h);

      let resized_image = canvas.toDataURL("image/jpeg", 1);

      //postavi preview
      //document.getElementById("img_prev_" + group_uuid).src = resized_image;

      //podela dataURL na delove
      let block = resized_image.split(";");

      //tip sadržaja
      let contentType = block[0].split(":")[1];

      //podaci base64string
      let new_realData = block[1].split(",")[1];

      //konverzija u blob objekt kako bi se slika mogla uploadovati
      //let blob = base64fns.b64toBlob(realData, contentType);

      img.base64ImageData = new_realData;

      img.contentType = contentType;

      img.width = w;

      img.height = h;

      //base64ImageData: realData,
      setPonuda_slike([...ponuda_slike, img]);
    };

    //postavi podatke
    new_img.src = "data:image/jpg;base64," + realData;
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();

    fileReader.onloadend = handleFileRead;

    fileReader.readAsDataURL(file);
  };

  //upis
  async function handleFormSubmit(e) {
    e.preventDefault();

    let formData = new FormData();

    //id
    formData.append("id_pon", id_pon);
    formData.append("brpon", ponuda_data.brpon);

    formData.append("bruto_cena_val", input_bruto_cena_val);

    formData.append("neto_cena_val", 0);
    formData.append("pdv_cena_val", 0);

    formData.append("id_brand", brand_selection_value);
    formData.append("id_model", model_selection_value);

    formData.append("tip", input_tip);

    formData.append("vat_ddct", false);

    formData.append("opis", input_opis);

    formData.append("dat_unos", null);
    formData.append(
      "dat_pon",
      input_dat_pon + " " + new Date(Date.now()).toLocaleTimeString()
    );

    formData.append("god_proizv", input_god_proizv);

    formData.append("dat_zatv", "");
    formData.append("tip_zatv", "");

    formData.append("real_bruto_cena_val", "");

    //tip karoserije
    formData.append("a000_karoserija", "");

    //vrsta goriva
    formData.append("a002_tip_goriva", "");

    formData.append("a001_broj_vrata", "");

    formData.append("a003_polovno", "");

    //kilometraža
    formData.append("a006_km", "");

    //CCM
    formData.append("a004_ccm", "");

    //snaga
    formData.append("a005_kw", "");

    //slike
    ponuda_slike.forEach((el, index) => {
      formData.append(
        "img-" + index,
        base64fns.b64toBlob(el.base64ImageData, "image/jpg"),
        "img-uuid-" + el.uuid
      );
    });

    let url = "http://localhost:3003/api/write_item/" + id_pon;

    await axios({
      method: "post",
      url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      processData: false,
      contentType: false,
    });
    
    //osveži store
    store.dispatch(setData((await axios("http://localhost:3003/api/get_all_items")).data));

    history.push("/");
   
    
  }

  return (
    <>
      <div className="edit_item_container">
        {edit_mode ? (
          <h2>Izmena oglasa br. {ponuda_data.brpon}</h2>
        ) : (
          <h2>Unos novog oglasa</h2>
        )}

        <form name="edit_item" action="" onSubmit={handleFormSubmit}>
          {/** bruto cena */}
          <div className="form_element">
            <label className="label_form_element" htmlFor="bruto_cena_val">
              Bruto cena eur:
            </label>
            <input
              type="number"
              name="bruto_cena_val"
              value={input_bruto_cena_val}
              //onBlur={brutoCenaValChange}
              onChange={(e) => setInput_bruto_cena_val(e.target.value)}
            />
          </div>

          {/** brend */}
          <div className="form_element">
            <label className="label_form_element" htmlFor="brand_list">
              Brend:
            </label>

            <select
              name="brand_list"
              id="brand_list"
              value={brand_selection_value}
              onChange={BrandSelectionValueChangedHandler}
            >
              {brand_lista.map((el) => (
                <option key={el.id_brand} value={el.id_brand}>
                  {el.brand}
                </option>
              ))}
            </select>
          </div>

          {/** model */}
          <div className="form_element">
            <label className="label_form_element" htmlFor="model_list">
              Model:
            </label>

            <select
              name="model_list"
              id="model_list"
              value={model_selection_value}
              onChange={(e) => setModel_selection_value(e.target.value)}
            >
              {model_lista.map((el) => (
                <option key={el.id_model} value={el.id_model}>
                  {el.model}
                </option>
              ))}
            </select>
          </div>

          {/** tip */}
          <div className="form_element">
            <label className="label_form_element" htmlFor="tip">
              Tip:
            </label>
            <input
              type="text"
              name="tip"
              value={input_tip}
              //onBlur={brutoCenaValChange}
              onChange={(e) => setInput_tip(e.target.value)}
            />
          </div>

          {/** godina proizv. */}
          <div className="form_element">
            <label className="label_form_element" htmlFor="god_proizv">
              Godina proizvodnje:
            </label>
            <input
              type="text"
              name="god_proizv"
              value={input_god_proizv}
              //onBlur={brutoCenaValChange}
              onChange={(e) => setInput_god_proizv(e.target.value)}
            />
          </div>

          {/** opis */}
          <div className="form_element">
            <label className="label_form_element" htmlFor="opis">
              Opis:
            </label>
            <textarea
              id="opis"
              name="opis"
              value={input_opis}
              rows="4"
              cols="50"
              onChange={(e) => setInput_opis(e.target.value)}
            ></textarea>
          </div>

          {/** datum ponude */}
          <div className="form_element">
            <label className="label_form_element" htmlFor="dat_pon">
              Datum ponude:
            </label>
            <input
              type="date"
              name="dat_pon"
              value={input_dat_pon}
              //onBlur={brutoCenaValChange}
              onChange={(e) => setInput_dat_pon(e.target.value)}
            />
          </div>

          {/** slike */}
          <div className="form_images">
            {ponuda_slike.map((el) => {
              return (
                <UpsertFormItemPhoto
                  key={el.uuid}
                  image_data={el.base64ImageData}
                  uuid={el.uuid}
                  removeItemPhoto={removeItemPhoto}
                />
              );
            })}
          </div>

          <div className="img_load_element">
            <label className="upload_file" htmlFor="img_load">
              Dodaj sliku...
            </label>
            <input
              type="file"
              name="img_load"
              id="img_load"
              onChange={(e) => handleFileChosen(e.target.files[0])}
              accept="image/*"
            />
          </div>
          <div className="form_submit_element">
            <button className="submit_btn" onClick={handleFormSubmit}>
              Save <i className="fas fa-check"></i>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpsertItem;
