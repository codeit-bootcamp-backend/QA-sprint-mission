import React from "react";
import styles from "./TagList.module.css";
import closeIcon from "../../assets/svg/X-icon.svg";

const TagList = ({ tags, handleTagDelete }) => (
  <div className={styles.tag_list}>
    {tags.map((tag, index) => (
      <div key={index} className={styles.tag_chip}>
        {tag}
        <img
          src={closeIcon}
          alt="닫기 아이콘"
          width="20"
          height="20"
          onClick={() => handleTagDelete(tag)}
        />
      </div>
    ))}
  </div>
);

export default TagList;
