// import { useState } from "react";
// import styles from "./Signin.module.css";
// import { postLogin } from "utils/api";

// function Signin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const loginData = { email, password };
//     const data = await postLogin(loginData);
//     const { accessToken } = data;
//     localStorage.setItem("accessToken", accessToken);
//   };

//   return (
//     <>
//       <form>
//         <label htmlFor="sign-up">
//           이메일
//           <br />
//           <div className={styles.input_container}>
//             <input
//               id="sign-up"
//               type="email"
//               placeholder="아이디를 입력해주세요"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//         </label>
//         <label htmlFor="password">
//           비밀번호
//           <br />
//           <div className={styles.input_container}>
//             <div className={styles.helper}>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="비밀번호를 입력해주세요"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <div className={styles.input_eye_off}>
//                 <img src="/src/assets/svg/eye-close-icon.svg" />
//               </div>
//             </div>
//           </div>
//         </label>
//         <button onClick={handleLogin}>로그인</button>
//         <div className={styles.another_signup}>
//           <div className={styles.another_signup_text}>간편 로그인하기</div>
//           <div className={styles.another_signup_logo}>
//             <a href="https://www.google.com/" target="_blank">
//               <img
//                 src="/src/assets/svg/google-login-icon.svg"
//                 alt="google-logo"
//               />
//             </a>
//             <a href="https://www.kakaocorp.com/page/" target="_blank">
//               <img
//                 src="/src/assets/svg/kakao-login-icon.svg"
//                 alt="kakao-logo"
//               />
//             </a>
//           </div>
//         </div>
//         <div className={styles.title_subtext}>
//           판다마켓이 처음이신가요?
//           <a href="signup.html" className={styles.deco_text}>
//             회원가입
//           </a>
//         </div>
//       </form>
//     </>
//   );
// }

// export default Signin;
