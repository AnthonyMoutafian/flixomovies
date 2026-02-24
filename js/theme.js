const themeBtn = document.querySelectorAll(".themeBtn");
const themeLink = document.getElementById("theme-style");

export default function applyTheme() {
  const theme = localStorage.getItem("theme") || "dark";

  if (!themeLink) return;

  themeBtn.forEach((el) => {
    if (theme === "dark") {
      themeLink.href = "./css/styleDark.css";
      el.classList.remove("bi-moon-fill");
      el.classList.add("bi-brightness-high-fill");
    } else {
      themeLink.href = "./css/styleLight.css";
      el.classList.remove("bi-brightness-high-fill");
      el.classList.add("bi-moon-fill");
    }
  });
}
