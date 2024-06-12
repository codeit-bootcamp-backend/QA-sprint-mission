import React, { useEffect, useCallback } from "react";
import "./CardList.css";
import Cards from "./Cards";
import usePagination from "hooks/usePagination";
import useWindowSize from "hooks/useWindowSize";
import arrow_left from "../../assets/svg/arrow_left-icon.svg";
import arrow_right from "../../assets/svg/arrow_right-icon.svg";

const CardList = ({ cards, sortOption, isSearchedToggle }) => {
  const sortedCards = [...cards].sort((a, b) => {
    if (sortOption === "최신순") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (sortOption === "좋아요순") {
      return b.favoriteCount - a.favoriteCount;
    }
    return 0;
  });

  const { width } = useWindowSize();

  const itemsPerPage = () => {
    if (width <= 767) {
      return 4; // Mobile
    } else if (width <= 1199) {
      return 6; // Tablet
    } else {
      return 10; // PC
    }
  };

  const {
    currentData,
    currentPage,
    maxPage,
    nextPage,
    prevPage,
    jumpToPage,
    updateItemsPerPage,
    goToFirstPage,
  } = usePagination(sortedCards, itemsPerPage());

  // 검색하면 첫번째 페이지로 이동
  useEffect(() => {
    goToFirstPage();
  }, [isSearchedToggle]);

  //화면 크기에 따라 보여줄 컨텐츠 수를 제어
  useEffect(() => {
    updateItemsPerPage(itemsPerPage());
  }, [width]);

  return (
    <div>
      <div className="card_list">
        {currentData().map((card) => (
          <Cards value={card} key={card.id} />
        ))}
      </div>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          <img
            src={arrow_left}
            aria-label="왼쪽화살표"
            className="arrow_left"
          />
        </button>
        {Array.from({ length: maxPage }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => jumpToPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === maxPage}>
          <img
            src={arrow_right}
            aria-label="왼쪽화살표"
            className="arrow_left"
          />
        </button>
      </div>
    </div>
  );
};

export default CardList;
