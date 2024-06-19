import styles from "./Cards.module.css";
import defaultImg from "../../assets/image/default-image.png";
import heartIcon from "../../assets/svg/heart-icon.svg";

export default function Cards({ value }) {
  const { name, price, favoriteCount, images } = value;
  const imageSource =
    images && images.length > 0 && !images[0].includes("example.com")
      ? images[0]
      : defaultImg;

  return (
    <li className={styles.card_container}>
      <a
        href="/#"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.card_wrapper}
      >
        <div className={styles.card_image_container}>
          <img className={styles.card_image} src={imageSource} alt={name} />
        </div>
        <div className={styles.card_info}>
          <div className={styles.card_title}>{name}</div>
          <div className={styles.card_price}>{price.toLocaleString()}원</div>
          <div className={styles.card_interest}>
            <img src={heartIcon} alt="하트 아이콘" width="16" height="16" />
            <div className={styles.card_count}>{favoriteCount}</div>
          </div>
        </div>
      </a>
    </li>
  );
}
