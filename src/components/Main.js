import MainListItemCard from "./MainListItemCard";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./Main.css";
import store from "./Store";
import { Link } from "react-router-dom";

function Main() {
  const [pagination_data, setPagination_data] = useState({
    offset: 0,
    numberPerPage: 4,
    pageCount: 0,
    currentData: [],
  });

  const [items, setItems] = useState(() => store.getState().data);
  const [user, setUser] = useState(() => store.getState().user);

  //postavi update stanja sa stora
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setItems(store.getState().data);
      setUser(store.getState().user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setPagination_data((val) => ({
      ...val,
      pageCount: items.length / val.numberPerPage,
      currentData: items.slice(val.offset, val.offset + val.numberPerPage),
    }));
  }, [pagination_data.numberPerPage, pagination_data.offset, items]);

  //handler promena stranice
  const handlePageClick = (event) => {
    const selected = event.selected;
    const offset = selected * pagination_data.numberPerPage;
    setPagination_data({ ...pagination_data, offset });
  };

  //console.log("state: ",state,"items:",items)

  return (
    <>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={pagination_data.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />

      {user.user_type === 2 ? (
        <div className="main_container_header">
          <div className="main_container_header_item">
            <div className="insert_link">
              <Link to="/insert_item/-1">
                <button className="insert_button">
                  <i className="material-icons">add</i>
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="main_container">
        {pagination_data.currentData &&
          pagination_data.currentData.map((item, index) => (
            <MainListItemCard
              key={item.id_pon}
              id_pon={item.id_pon}
              index={index}
            />
          ))}
      </div>
    </>
  );
}

export default Main;
