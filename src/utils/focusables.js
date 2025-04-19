import { FOCUSABLE_ELEMENTS } from "../global/constants";

/**
 * Function to get all focusable elements wihtin a container
 * @param {HTMLElement} el - the target container (JS | jQuery object)
 * @returns {Array} - array of focusable elements
 */
export const getFocusableElements = (el) => {
  const isVisible = (element) => element.offsetWidth || element.offsetHeight || element.getClientRects().length;

  const getFocusableChildren = (rootElem) => {
    const elements = [...rootElem.querySelectorAll(FOCUSABLE_ELEMENTS.join(','))];
    return elements.filter(isVisible);
  };

  return getFocusableChildren(el);
};

/**
 * Function to get the next or previous focusable element on the page relative to the current container
 * @param {HTMLElement} el - the current container (JS | jQuery object)
 * @param {String} direction - 'prev' or 'next' to get the previous or next focusable element
 * @returns DOM element (JS object) or false
 */
export const getFocusableElementonPage = (el, direction) => {
  const _el = el.length && el.nodeName.toLowerCase() !== 'select' ? el[0] : el;
  const allFocusableEl = getFocusableElements(document.body);
  const localFirstFocusableEl =
    (direction === 'prev' ? getFocusableElements(_el).shift() : getFocusableElements(_el).pop()) || _el;
  const index =
    allFocusableEl.indexOf(localFirstFocusableEl) === -1
      ? allFocusableEl.indexOf(_el)
      : direction === 'prev'
        ? allFocusableEl.indexOf(localFirstFocusableEl) - 1
        : allFocusableEl.indexOf(localFirstFocusableEl) + 1;
  return allFocusableEl[index] || false;
};