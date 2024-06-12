import React from "react";
import "./Nav.css";
import logo from "../assets/svg/Logo-Large.svg";
import logo_small from "../assets/svg/Logo-Small.svg";

const Nav = () => {
  return (
    <nav role="navigation">
      <div className="header_nav">
        <img src={logo} aria-label="판다마켓로고" className="nav_logo" />

        {/* 모바일용 */}
        <img
          src={logo_small}
          aria-label="판다마켓로고"
          className="mobile_nav_logo"
        />

        <div className="header_category">
          <a className="category_btn" href="/">
            자유게시판
          </a>
          <a className="category_btn blue" href="/">
            중고마켓
          </a>
        </div>
        <a className="login_btn" href="/pages/signin.html">
          로그인
        </a>
      </div>
    </nav>
  );
};

export default Nav;
