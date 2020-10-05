import MainListItemCard from "./MainListItemCard";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./Main.css";
import store from "./Store";
import { Link } from "react-router-dom";

function Main() {
  const [state, setState] = useState(store.getState());

  //postavi update stanja sa stora
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      pageCount: prev.data.length / prev.numberPerPage,
      currentData: prev.data.slice(
        prev.offset,
        prev.offset + prev.numberPerPage
      ),
    }));
  }, [state.numberPerPage, state.offset, state.data]);

  //handler promena stranice
  const handlePageClick = (event) => {
    const selected = event.selected;
    const offset = selected * state.numberPerPage;
    setState({ ...state, offset });
  };

  return (
    <>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={state.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />

      {state.user_type === 2 ? (
        <div className="insert_div">
          <Link to="/insert_item/-1">
            <i className="material-icons insert_btn">&#xe89c;</i>
          </Link>
        </div>
      ) : (
        ""
      )}

      <div className="container">
        {state.currentData &&
          state.currentData.map((item, index) => (
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
