import styles from "./Footer.module.css";
import facebook from "../assets/svg/facebook-icon.svg";
import instagram from "../assets/svg/instagram-icon.svg";
import twitter from "../assets/svg/twitter-icon.svg";
import youtube from "../assets/svg/youtube-icon.svg";

const SnsLogo = [
  { href: "https://www.facebook.com/", src: facebook, alt: "facebook" },
  { href: "https://twitter.com/", src: twitter, alt: "twitter" },
  { href: "https://www.youtube.com/", src: youtube, alt: "youtube" },
  { href: "https://www.instagram.com/", src: instagram, alt: "instagram" },
];

const FooterSns = ({ href, src, alt }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <img src={src} alt={alt} />
    </a>
  );
};

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.copyright}>©codeit - 2024</div>
        <div className={styles.explain}>
          <a className={styles.policy} href="./privacy.html">
            privacy policy
          </a>
          <a className={styles.faq} href="./faq.html">
            FAQ
          </a>
        </div>
        <div className={styles.footer_sns}>
          {SnsLogo.map((sns) => (
            <FooterSns key={sns.alt} {...sns} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Footer;
