import React from "react";
import "./GeneralSection.css";
import CardList from "components/GeneralSection/CardList";
import SearchBar from "components/searchBar/SearchBar";
import Button from "components/button/Button";
import SortButton from "components/button/SortButton";
import { useState } from "react";

const GeneralSection = ({ cards, onSearch }) => {
  const [sortOption, setSortOption] = useState("최신순");
  const [isSearchedToggle, setIsSearchedToggle] = useState(false);

  const isSearched = () => {
    setIsSearchedToggle((prev) => !prev);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleSearch = (searchTerm) => {
    onSearch(searchTerm);
  };

  return (
    <section className="general_section_container">
      <div className="title_bar">
        <p className="title">판매 중인 상품</p>
        <div className="title_contents">
          <SearchBar onSearch={handleSearch} isSearched={isSearched} />
          <div className="mobile_container">
            <Button color="blue">상품 등록하기</Button>
            <SortButton onSortChange={handleSortChange}>
              {sortOption}
            </SortButton>
          </div>
        </div>
      </div>
      <CardList
        cards={cards}
        sortOption={sortOption}
        isSearchedToggle={isSearchedToggle}
      />
    </section>
  );
};

export default GeneralSection;
