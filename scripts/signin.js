import { errorMessageStop, addErrorStyle } from "./errors/errors.js";
import { checkPassword } from "./input/checkPassword.js";
import { toggleImage } from "./toggleImage.js";
import {
  inputEmail,
  inputPassword,
  emailErrorMessage,
  passwordErrorMessage,
  USER_DATA,
} from "./constants.js";
import { checkEmailFormat } from "./input/checkEmailFormat.js";
import { validAccount } from "./auth/validConfirm.js";
import { hideModal, showModal } from "./components/modal.js";

const eyeImagePasswordEl = document.querySelector("#eyeImage-password");
const eyeImagePassword = eyeImagePasswordEl.children[0];
const submitButton = document.querySelector('button[type="submit"]');
const loginForm = document.querySelector("form");

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.createElement("div");
  modal.id = "error-modal";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <p id="modal-message"></p>
      <button id="confirm-button" class="confirm-button">확인</button>
    </div>
  `;

  // 모달을 body에 추가하고 최초에 숨김처리
  document.body.appendChild(modal);
  hideModal();

  // confirmButton 클릭 시 모달 숨기기
  const confirmButton = document.getElementById("confirm-button");
  confirmButton.addEventListener("click", hideModal);
});

function validateForm() {
  const emailValid =
    inputEmail.value.trim() !== "" && emailErrorMessage.textContent === "";
  const passwordValid =
    inputPassword.value.trim() !== "" &&
    passwordErrorMessage.textContent === "";
  submitButton.disabled = !(emailValid && passwordValid);
}

// 눈모양 아이콘 클릭 시 비밀번호 입력타입 변경 및 폼 유효성 검사
eyeImagePassword.addEventListener("click", () => {
  toggleImage(eyeImagePassword, inputPassword);
  validateForm();
});

// 입력 중에는 에러 메시지 숨기기
inputEmail.addEventListener("input", () => {
  errorMessageStop();
  validateForm();
});
inputPassword.addEventListener("input", () => {
  errorMessageStop();
  validateForm();
});

// 이메일 형식 검증 및 에러 메시지 출력
inputEmail.addEventListener("focusout", () => {
  checkEmailFormat();
  validateForm();
});

// 비밀번호 빈 값일 때 에러 메시지 출력
inputPassword.addEventListener("focusout", () => {
  checkPassword();
  validateForm();
});

// 모달 초기 숨김 상태 및 유효성 검사 호출
validateForm();

// 로그인 폼 제출 시 계정 유효성 검사 및 모달 표시
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = inputEmail.value.trim();
  const password = inputPassword.value;
  const isValid = validAccount(email, password);

  if (!isValid) {
    showModal("존재하지 않는 이메일, 혹은 비밀번호입니다");
  }
});

// 페이지 로드 시 초기 유효성 검사 호출
document.addEventListener("DOMContentLoaded", () => {
  hideModal();
  validateForm();
});
