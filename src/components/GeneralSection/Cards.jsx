import "./Cards.css";
import defaultImg from "../../assets/image/default-image.png";
import heartIcon from "../../assets/svg/heart-icon.svg";

export default function Cards({ value }) {
  const { name, price, favoriteCount, images } = value;
  const imageSource =
    images && images.length > 0 && !images[0].includes("example.com")
      ? images[0]
      : defaultImg;

  return (
    <li className="card_container">
      <a
        href="/#"
        target="_blank"
        rel="noopener noreferrer"
        className="card_wrapper"
      >
        <div className="card_image_container">
          <img className="card_image" src={imageSource} alt={name} />
        </div>
        <div className="card_info">
          <div className="card_title">{name}</div>
          <div className="card_price">{price.toLocaleString()}원</div>
          <div className="card_interest">
            <img src={heartIcon} alt="하트 아이콘" width="16" height="16" />
            <div className="card_count">{favoriteCount}</div>
          </div>
        </div>
      </a>
    </li>
  );
}
