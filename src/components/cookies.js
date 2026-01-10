function getCurrentTheme() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith("theme=")) {
      console.log(cookie);
      return cookie.split("=")[1];
    }
  }
  return "light"; //default theme
}
export { getCurrentTheme };
