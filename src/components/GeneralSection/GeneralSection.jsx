import React from "react";
import styles from "./GeneralSection.module.css";
import CardList from "components/GeneralSection/CardList";
import SearchBar from "components/searchBar/SearchBar";
import Button from "components/button/Button";
import SortButton from "components/button/SortButton";
import { useState } from "react";
import { Link } from "react-router-dom";

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
    <section className={styles.general_section_container}>
      <div className={styles.title_bar}>
        <p className={styles.title}>판매 중인 상품</p>
        <div className={styles.title_contents}>
          <SearchBar onSearch={handleSearch} isSearched={isSearched} />
          <div className={styles.mobile_container}>
            <Link to="/registration">
              <Button color="blue">상품 등록하기</Button>
            </Link>
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
