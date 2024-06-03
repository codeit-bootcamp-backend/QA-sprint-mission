import { addErrorStyle } from "../errors/errors.js";
import {
  USER_DATA,
  inputEmail,
  inputPassword,
  emailErrorMessage,
  passwordErrorMessage,
} from "../constants.js";

// <아이디&비밀번호 올바르게 입력했을 경우 /items로 이동하고 아닌 경우 확인메시지 출력>
export function validAccount(email, password) {
  const accountMatch = USER_DATA.find((account) => account.email === email);

  if (accountMatch && accountMatch.password === password) {
    window.location.href = "./items.html";
    return true;
  }

  if (!accountMatch) {
    addErrorStyle(inputEmail, emailErrorMessage, "이메일을 확인해주세요.");
  } else if (accountMatch.password !== password) {
    addErrorStyle(
      inputPassword,
      passwordErrorMessage,
      "비밀번호를 확인해주세요."
    );
  }

  return false;
}
