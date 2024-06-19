import React from "react";
import styles from "./Nav.module.css";
import logo from "../assets/svg/Logo-Large.svg";
import logo_small from "../assets/svg/Logo-Small.svg";

const Nav = () => {
  return (
    <nav role="navigation">
      <div className={styles.header_nav}>
        <img src={logo} aria-label="판다마켓로고" className={styles.nav_logo} />

        {/* 모바일용 */}
        <img
          src={logo_small}
          aria-label="판다마켓로고"
          className={styles.mobile_nav_logo}
        />

        <div className={styles.header_category}>
          <a className={styles.category_btn} href="/">
            자유게시판
          </a>
          <a className={`${styles.category_btn} ${styles.blue}`} href="/">
            중고마켓
          </a>
        </div>
        <a className={styles.login_btn} href="/login">
          로그인
        </a>
      </div>
    </nav>
  );
};

export default Nav;
