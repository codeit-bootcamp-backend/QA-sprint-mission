import { useState } from "react";

const usePagination = (data, initialItemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const maxPage = Math.ceil(data.length / itemsPerPage);

  const currentData = () => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const jumpToPage = (page) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  };

  const updateItemsPerPage = (newItemsPerPage) => {
    setCurrentPage(1);
    setItemsPerPage(newItemsPerPage);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    currentData,
    currentPage,
    maxPage,
    nextPage,
    prevPage,
    jumpToPage,
    updateItemsPerPage,
    goToFirstPage,
  };
};

export default usePagination;
