import React from "react";
import "./UpsertFormItemPhoto.css";

function UpsertFormItemPhoto({ image_data, uuid, removeItemPhoto }) {
  function removeSelf(e) {
    removeItemPhoto(uuid);
  }

  return (
    <div className="edit_item_card">
      <img
        className="photo"
        src={"data:image/jpg;base64," + image_data}
        alt=""
      />
      <div className="trash_link_container">
        <i className="trash_link far fa-trash-alt" onClick={removeSelf}></i>
      </div>
    </div>
  );
}

export default UpsertFormItemPhoto;
