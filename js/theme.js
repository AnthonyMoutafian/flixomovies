export default function applyTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  const themeLink = document.getElementById("theme-style");

  if (themeLink) {
    if (theme === "dark") {
      themeLink.href = "./css/styleDark.css";
    } else {
      themeLink.href = "./css/styleLight.css";
    }
  }

  const themeBtns = document.querySelectorAll(".themeBtn");
  themeBtns.forEach((el) => {
    // In hamburger menu, do not add upper icon pseudo-elements or toggle moon icon
    if (el.classList.contains("hamburger-action-card") || el.tagName === "BUTTON") {
      el.classList.remove("bi-moon-fill", "bi-brightness-high-fill");
      const innerIcon = el.querySelector("i");
      if (innerIcon) {
        innerIcon.classList.remove("bi-moon-fill");
        innerIcon.classList.add("bi-brightness-high-fill");
      }
      return;
    }

    if (theme === "dark") {
      el.classList.remove("bi-moon-fill");
      el.classList.add("bi-brightness-high-fill");
    } else {
      el.classList.remove("bi-brightness-high-fill");
      el.classList.add("bi-moon-fill");
    }
  });
}
