import React from "react";
import styles from "./BestSection.module.css";
import BestCardList from "components/BestSection/BestCardList";

const BestSection = ({ bestCards }) => {
  return (
    <section className={styles.best_section_container}>
      <div className={styles.best_title_bar}>
        <p className={styles.best_title}>베스트 상품</p>
      </div>
      <BestCardList bestCards={bestCards} sortOption={"좋아요순"} />
    </section>
  );
};

export default BestSection;
