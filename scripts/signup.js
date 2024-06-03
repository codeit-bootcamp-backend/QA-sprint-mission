import {
  errorMessageStop,
  addErrorStyle,
  removeErrorStyle,
} from "./errors/errors.js";
import { toggleImage } from "./toggleImage.js";
import { checkPassword } from "./input/checkPassword.js";
import {
  USER_DATA,
  inputEmail,
  inputPassword,
  emailErrorMessage,
  passwordErrorMessage,
} from "./constants.js";
import { checkEmailFormat } from "./input/checkEmailFormat.js";
import { hideModal, showModal } from "./components/modal.js";

const eyeImagePasswordEl = document.querySelector("#eyeImage-password");
const eyeImagePasswordReEl = document.querySelector("#eyeImage-password-re");
const eyeImagePassword = eyeImagePasswordEl.children[0];
const eyeImagePasswordRe = eyeImagePasswordReEl.children[0];
const submitButton = document.querySelector('button[type="submit"]');
const signupForm = document.querySelector("form");
const inputPasswordRe = document.querySelector("#password-re");
const passwordReErrorMessage = document.querySelector(
  ".password-re-error-message"
);

document.addEventListener("DOMContentLoaded", () => {
  // 모달을 생성합니다.
  const modal = document.createElement("div");
  modal.id = "error-modal";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <p id="modal-message"></p>
      <button id="confirm-button" class="confirm-button">확인</button>
    </div>
  `;

  // 모달을 body에 추가합니다.
  document.body.appendChild(modal);

  // 페이지가 로드될 때 모달을 숨깁니다.
  hideModal();

  // confirmButton 클릭 시 모달 숨기기
  const confirmButton = document.getElementById("confirm-button");
  confirmButton.addEventListener("click", hideModal);
});

// <눈모양 아이콘 적용, 비밀번호 입력타입 변경>
eyeImagePassword.addEventListener("click", () => {
  toggleImage(eyeImagePassword, inputPassword);
});
eyeImagePasswordRe.addEventListener("click", () => {
  toggleImage(eyeImagePasswordRe, inputPasswordRe);
});

//<입력하는 동안에는 에러메시지 안 보이게 하기>
inputEmail.addEventListener("input", () => {
  errorMessageStop();
  validateForm();
});
inputPassword.addEventListener("input", () => {
  errorMessageStop();
  validateForm();
});
inputPasswordRe.addEventListener("input", () => {
  errorMessageStop();
  validateForm();
});

//<이메일 형식 검증>
inputEmail.addEventListener("focusout", () => {
  checkEmailFormat();
  validateForm();
});

//<비밀번호 형식 검증>
inputPassword.addEventListener("focusout", () => {
  checkPassword();
  validateForm();
});

// 비밀번호-비밀번호 확인 값 일치 확인
function checkPasswordRe() {
  const password = inputPassword.value;
  const passwordRe = inputPasswordRe.value;
  if (password !== passwordRe) {
    addErrorStyle(
      inputPasswordRe,
      passwordReErrorMessage,
      "비밀번호가 일치하지 않아요."
    );
    return false;
  } else {
    removeErrorStyle(inputPasswordRe, passwordReErrorMessage);
    return true;
  }
}
inputPasswordRe.addEventListener("focusout", checkPasswordRe);

// 폼 유효성 검사 및 버튼 상태 업데이트
function validateForm() {
  const isEmailValid =
    inputEmail.value.trim() !== "" && emailErrorMessage.textContent === "";
  const isPasswordValid =
    inputPassword.value.trim() !== "" &&
    passwordErrorMessage.textContent === "";
  const isPasswordReValid =
    inputPasswordRe.value.trim() !== "" &&
    passwordReErrorMessage.textContent === "";

  submitButton.disabled = !(
    isEmailValid &&
    isPasswordValid &&
    isPasswordReValid
  );
}

console.log("1번");
// 이메일과 비밀번호 모두 유효한 값이라면 버튼 동작하도록 함

function submitAccount() {
  const isEmailValid = checkEmailFormat();
  const isPasswordValid = checkPassword();
  const isPasswordReValid = checkPasswordRe();

  if (isEmailValid && isPasswordValid && isPasswordReValid) {
    return true;
  }
  return false;
}

validateForm();
console.log("2번");

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // 이메일과 비밀번호 입력값 가져오기
  const email = inputEmail.value.trim();
  const password = inputPassword.value.trim();

  // 이미 있는 이메일인지 확인
  const isExistingEmail = USER_DATA.some((user) => user.email === email);
  console.log("4번");
  // 이미 있는 이메일인 경우 모달 표시
  if (isExistingEmail) {
    console.log("이메일 중복");
    showModal("중복된 이메일입니다.");
    return; // 함수 종료
  }
  console.log("5번");

  // 유효성 검사 통과 후 회원가입 진행
  if (submitAccount()) {
    window.location.href = "./items.html";
  }
});

hideModal();
validateForm();
