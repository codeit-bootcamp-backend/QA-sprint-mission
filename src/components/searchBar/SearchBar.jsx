import { useState } from "react";
import styles from "./SearchBar.module.css";
import searchIcon from "../../assets/svg/search-icon.svg";

export default function SearchBar({ onSearch, isSearched }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <form
      className={styles.form_search}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(searchTerm);
        isSearched();
      }}
    >
      <fieldset className={styles.search_wrapper}>
        <img src={searchIcon} alt="검색 아이콘" />
        <input
          id="searchInput"
          className={styles.search_input}
          type="text"
          placeholder="검색할 상품을 입력해주세요."
          aria-label="검색어를 입력하는 입력 요소입니다."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </fieldset>
    </form>
  );
}
