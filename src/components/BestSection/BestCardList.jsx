import React from "react";
import styles from "./BestCardList.module.css";
import BestCards from "./BestCards";

const BestCardList = ({ bestCards, sortOption }) => {
  const sortedCards = [...bestCards].sort((a, b) => {
    if (sortOption === "최신순") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (sortOption === "좋아요순") {
      return b.favoriteCount - a.favoriteCount;
    }
    return 0;
  });

  return (
    <div className={styles.best_card_list}>
      {sortedCards.map((bestCards) => (
        <BestCards value={bestCards} key={bestCards.id} />
      ))}
    </div>
  );
};

export default BestCardList;
