export default (isScreenActive) => {
  const rulesItems = document.querySelectorAll(`.rules__item`);
  const animationClassName = `rules__item--animationing`;

  function addClassname(el) {
    el.classList.add(animationClassName);
  }

  function removeClassname(el) {
    el.classList.remove(animationClassName);
  }

  function ruleAnimationEndHandler({target}) {
    const next = target.nextElementSibling;

    if (next) {
      addClassname(next);
    }

    target.removeEventListener(`animationend`, ruleAnimationEndHandler);
  }

  for (let i = 0; i < rulesItems.length; i++) {
    const item = rulesItems[i];

    if (!isScreenActive && item.classList.contains(animationClassName)) {
      removeClassname(item);
      continue;
    }

    item.addEventListener(`animationend`, ruleAnimationEndHandler);
  }

  if (isScreenActive) {
    addClassname(rulesItems[0]);
  }
};
