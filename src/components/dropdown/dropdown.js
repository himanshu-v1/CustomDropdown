import { KEY_DOWN, ENTER_KEY, SPACE_KEY, ARROW_DOWN, ARROW_UP, TAB_KEY, HOME_KEY, END_KEY, ESCAPE_KEY } from "../../global/constants";
import { getFocusableElementonPage } from "../../utils/focusables";

let customDDKeyStroke = '';
const inputMapper = {};

function reformDropdown(dropdown) {
  const ddFormRow = dropdown?.closest('.guidefield');

  if (!ddFormRow || ddFormRow.classList.contains('dropdown-updated')) {
    console.warn('Dropdown not found or already updated');
    return;
  }

  const select = dropdown.querySelector('select');

  const customSelect = document.createElement('input');
  customSelect.setAttribute('name', select.getAttribute('name'));
  customSelect.setAttribute('id', select.getAttribute('id'));
  customSelect.setAttribute('autocomplete', 'off');
  customSelect.setAttribute('aria-labelledby', select.getAttribute('aria-labelledby'));
  customSelect.setAttribute('aria-required', select.getAttribute('aria-required'));
  customSelect.setAttribute('role', 'selectbox');
  if(select.classList.length) {
    customSelect.classList.add(...select.classList);
  }
  addFocusBlurEvents(customSelect);
  select.parentNode.insertBefore(customSelect, select);

  const dropdownOptions = dropdown.querySelectorAll('option');
  const customDropdown = document.createElement('ul');
  dropdown.style.position = 'relative';
  customDropdown.classList.add('custom-dropdown-menu');
  select.setAttribute('hidden', 'true');

  customSelect.addEventListener('click', () => {
    customDropdown.style.display = customDropdown.style.display === 'none' ? 'block' : 'none';
  });

  const clickEvent = (option) => {
    markAsActive(dropdown, option.value);
    select.value = option.value;
    customSelect.value = option.innerText;
    customSelect.dataset.value = option.value;
    customDropdown.style.display = 'none';
    select.dispatchEvent(new Event('change'));
    customSelect.focus();
  };

  const createCustomOption = (options) => {
    options.forEach((option, index) => {
      option.style.display = 'none';
      if (option.value) {
        const customOption = document.createElement('li');
        customOption.classList.add('custom-option');
        customOption.textContent = option.textContent;
        customOption.dataset.value = option.value;
        customOption.dataset.index = index;
        customOption.tabIndex = 0;
        customOption.setAttribute('role', 'option');
        customOption.setAttribute('aria-selected', 'false');
        customOption.addEventListener('click', clickEvent.bind(this, option, customOption));
        customOption.addEventListener(KEY_DOWN, (e) => {
          if (e.key === ENTER_KEY) {
            clickEvent(option, customOption);
          }
        });
        addFocusBlurEvents(customOption);
        customDropdown.appendChild(customOption);
      }
    });
  };

  // some options like country list loads from API and are not available at the time of dropdown creation
  // so we need to wait for them to be added to the DOM and then create custom options
  if (dropdownOptions.length) {
    createCustomOption(dropdownOptions);
  } else {
    const observer = new MutationObserver(() => {
      const options = dropdown.querySelectorAll('option');
      if (options.length) {
        createCustomOption(options);
        updateKeyMapper(select.id, customDropdown.querySelectorAll('.custom-option'));
        observer.disconnect();
      }
    });
    observer.observe(dropdown, {
      childList: true,
      subtree: true,
    });
  }

  customDropdown.style.display = 'none';
  dropdown.appendChild(customDropdown);
  ddFormRow.classList.add('dropdown-updated');
  handleOutsideClick(dropdown, customDropdown);
  handleAccessibility(dropdown, customDropdown);
  pullFormElementsIntoViewOnFocus(dropdown);
}

function handleOutsideClick(dropdown, customDropdown) {
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      customDropdown.style.display = 'none';
    }
  });
}

function getMapKey(str, optionValueMap) {
  const regex = new RegExp(String.raw`^${str}`, 'g');
  const key = Object.entries(optionValueMap)
    .map((key) => {
      if (regex.test(key.toString().toLowerCase())) {
        return key.toString();
      }
      return undefined;
    })
    .filter((key) => key)[0]
    ?.split(',')[1];
  return key;
}

function updateKeyMapper(id, customOptions) {
  inputMapper[id] = Array.from(customOptions).reduce((acc, option) => {
    acc[option.innerText] = option.dataset.value;
    return acc;
  }, {});
}

function handleAccessibility(dropdown, customDropdown) {
  const select = dropdown.querySelector('input');
  const customOptions = customDropdown.querySelectorAll('.custom-option');
  updateKeyMapper(select.id, customOptions);

  select.addEventListener(KEY_DOWN, (e) => {
    const selectedOption = getSelectedOption(dropdown);
    let strokeTimer = null;

    switch (e.key) {
      case ENTER_KEY:
      case SPACE_KEY: {
        e.preventDefault();
        customDropdown.style.display = customDropdown.style.display === 'none' ? 'block' : 'none';
        if (customDropdown.style.display === 'block') {
          if (selectedOption) {
            selectedOption.focus();
          } else {
            customOptions[0].focus();
          }
        }
        break;
      }
      case ARROW_DOWN: {
        e.preventDefault();
        customDropdown.style.display = 'block';
        const nextOption = selectedOption ? selectedOption.nextElementSibling : customOptions[0];
        if (nextOption) nextOption.focus();
        break;
      }
      case ARROW_UP: {
        e.preventDefault();
        customDropdown.style.display = 'block';
        const prevOption = selectedOption
          ? selectedOption.previousElementSibling
          : customOptions[customOptions.length - 1];
        if (prevOption) prevOption.focus();
        break;
      }
      default:
        if (e.key.length === 1 && e.key.match(/^[a-zA-Z]+$/)) {
          e.preventDefault();
          customDDKeyStroke += e.key;
          const key = getMapKey(customDDKeyStroke, inputMapper[select.id]);
          if (strokeTimer) {
            clearTimeout(strokeTimer);
          } else {
            strokeTimer = setTimeout(() => {
              customDDKeyStroke = '';
              dropdown.querySelector(`.custom-option[data-value="${key}"]`)?.click();
            }, 1000);
          }
        }
        break;
    }
  });

  customOptions.forEach((option) => {
    option.addEventListener(KEY_DOWN, (e) => {
      e.preventDefault();
      switch (e.key) {
        case TAB_KEY: {
          customDropdown.style.display = 'none';
          const nextFocusable = getFocusableElementonPage(select, 'next');
          if (nextFocusable) nextFocusable.focus();
          break;
        }
        case ARROW_DOWN:
          e.target.nextSibling?.focus();
          break;
        case ARROW_UP:
          e.target.previousSibling?.focus();
          break;
        case HOME_KEY: {
          e.preventDefault();
          const firstOption = customOptions[0];
          firstOption.focus();
          break;
        }
        case END_KEY: {
          e.preventDefault();
          const lastOption = customOptions[customOptions.length - 1];
          lastOption.focus();
          break;
        }
        case ESCAPE_KEY:
          customDropdown.style.display = 'none';
          select.focus();
          break;
        default:
          break;
      }
    });
  });
}

function getSelectedOption(dropdown) {
  const select = dropdown.querySelector('select');
  return markAsActive(dropdown, select.value);
}

function markAsActive(dropdown, value) {
  const selectedOption = dropdown.querySelector(`.custom-option[data-value="${value}"]`);
  if (selectedOption) {
    const currActiveOption = dropdown.querySelector('.custom-option.active');
    currActiveOption?.classList.remove('active');
    currActiveOption?.setAttribute('aria-selected', 'false');

    selectedOption.classList.add('active');
    selectedOption.setAttribute('aria-selected', 'true');
    return selectedOption;
  } else {
    return null;
  }
}

function pullFormElementsIntoViewOnFocus(dropdown) {
  const formElements = dropdown
    .closest('.aemformcontainer')
    .querySelectorAll('input, select, textarea, button, .custom-option');
  const screenHeight = window.innerHeight;

  formElements.forEach((el) => {
    el.addEventListener('focus', (e) => {
      // scrollIntoViewIfNeeded does not work in firefox
      if (e.target.scrollIntoViewIfNeeded) {
        e.target.scrollIntoViewIfNeeded(false);
      } else {
        const elementTop = e.target.getBoundingClientRect().top;
        if (elementTop < 0 || elementTop > screenHeight) {
          e.target.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
      }
    });
  });
}

function addFocusBlurEvents(el) {
  el.addEventListener('focus', () => {
    el.closest('.guideFieldNode').classList.add('guideActiveField');
  });
  el.addEventListener('blur', () => {
    el.closest('.guideFieldNode').classList.remove('guideActiveField');
  });
}

function initReform(dropdownId, options) {
  options = options || {};
  console.log('Reform dropdown init', dropdownId, options);
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) {
    console.warn('Dropdown not found');
    return;
  }
  setTimeout(() => {
    reformDropdown(dropdown);
  }, 1000);
}

export default initReform;