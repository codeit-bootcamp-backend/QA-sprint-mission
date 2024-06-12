import React from "react";
import "./BestSection.css";
import BestCardList from "components/BestSection/BestCardList";

const BestSection = ({ bestCards }) => {
  return (
    <section className="best_section_container">
      <div className="best_title_bar">
        <p className="best_title">베스트 상품</p>
      </div>
      <BestCardList bestCards={bestCards} sortOption={"좋아요순"} />
    </section>
  );
};

export default BestSection;
