export function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}

export function resetResume() {
  document.querySelectorAll(".editable").forEach((item) => {
    item.textContent = item.dataset.default || "";
    localStorage.removeItem(item.className);
  });
}
