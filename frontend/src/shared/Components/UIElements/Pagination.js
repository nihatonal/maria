import React, { useEffect, useState } from "react";

import ReactPaginate from "react-paginate";

// Example items, to simulate fetching from another resources.
// const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

import './Pagination.css'

export default function Pagination({ itemsPerPage, data, deleteHandler }) {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);

  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
  
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${newOffset}`
    // );
    setItemOffset(newOffset);
  };

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>№</th>
            <th>Русский</th>
            <th>Английский</th>
            <th>..</th>
          </tr>
          {currentItems &&
            currentItems.map((el, index) => (
              <tr key={index}>
                <td>{itemOffset + 1 + index}</td>
                <td>{el.ru}</td>
                <td>{el.en}</td>
                <td id={el.id} onClick={deleteHandler}>
                  X
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ReactPaginate
        nextLabel=">"
        previousLabel="<"
        breakLabel="..."
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        activeClassName="active_page"
      />
    </>
  );
}
