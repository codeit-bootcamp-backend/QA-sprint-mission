// <눈모양 아이콘 적용, 비밀번호 입력타입 변경>
function toggleImage(image, inputPassword) {
  if (image.src.includes("eye-close")) {
    image.setAttribute("src", "/src/assets/svg/eye-open-icon.svg");
    inputPassword.setAttribute("type", "text");
  } else {
    image.setAttribute("src", "/src/assets/svg/eye-close-icon.svg");
    inputPassword.setAttribute("type", "password");
  }
}

export { toggleImage };
