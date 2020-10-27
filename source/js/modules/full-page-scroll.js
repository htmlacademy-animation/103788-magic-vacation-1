import throttle from 'lodash/throttle';
import animateRules from "./rules";

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.screenBackground = document.querySelector(`.screen--background`);
    this.screenBackgroundClassName = `screen--background--active`;

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  isPrizesScreenActive() {
    return this.screenElements[this.activeScreen].id === `prizes`;
  }

  isStoryScreenActive() {
    return this.screenElements[this.activeScreen].id === `story`;
  }

  isRulesScreenActive() {
    return this.screenElements[this.activeScreen].id === `rules`;
  }

  switchBackground() {
    if (this.isPrizesScreenActive()) {
      this.screenElements[this.activeScreen].classList.add(`screen--animationing`);

      this.screenElements[this.activeScreen].addEventListener(`animationend`, (evt) => {
        if (evt.animationName.match(/screen--prizes--bg-slide-up/)) {
          this.screenElements[this.activeScreen].classList.remove(`screen--animationing`);
        }
      });
    } else if (this.isStoryScreenActive()) {
      this.screenElements[this.activeScreen].classList.add(`screen--animationing`);

      this.screenElements[this.activeScreen].addEventListener(`animationend`, (evt) => {
        if (evt.animationName.match(/screen--prizes--bg-slide-up/)) {
          this.screenElements[this.activeScreen].classList.remove(`screen--animationing`);
        }
      });
    }

    animateRules(this.isRulesScreenActive());
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.switchBackground();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
      screen.classList.remove(`screen--animationing`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    this.screenElements[this.activeScreen].classList.add(`active`);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
