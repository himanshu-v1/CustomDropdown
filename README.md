# CustomDropdown
This script is to create a custom UI element from the HTML default OOTB select element. In order to work:
  - select must be wrapped inside a div with class guidefield,
  - select must have a unique ID attached to it.

_For Example:_
`
<element class="gidefield">
  <select id="<unique ID>">...</select>
</element>
`

Key features:
- Supports ___dynamically created options___ list i.e. either dependent on an __API response__ or __another script__ to create options dynamically.
- Supports full OOTB select featues with following keyboard accessibility:
  - When dropdown element is in focus:
    - `Enter` or `Space` key opens up the dropdown list and
      - shift focus on ___first___ element of the list _(if no option is selected)_
      - shift focus on the ___selected___ element of the list _(if one of the option is already selected)_
    - `Up` arrow opens up the dropdown and
      - focuses on the preious option of the selected option _(if one option is already selected)_
      - focuses on ___last___ option _(if no option is selected or there is no option before selected option)_
    - `Down` arrow opens up the dropdown and
      - focuses on the ___next___ option of the selected option _(if one option is already selected)_
      - focuses on ___first___ option (if no option is selected or there is no option after selected option)
    - `Tab` will shift focus on the ___next focusable element___ on the page _(added as in-built feature)_
  - When option list in in focus:
    - `Up` & `Down` arrow can be used to do through the options list.
    - `Enter` or `Space` button will select the currently focused option.
    - `Home` button will shift focus to the first option.
    - `End` button will shift focus to the last option.
    - `Tab` button will close the options menu and shift focus to the next focusable element on the page.
    - `Esc` button will close the options menu and shift focus to the dropdown input element.
  - Input box supports typed selection. When in focus, typing will select the first option in the dropdown that starts with the types phrase. Phrase ___resets after 1 second of inactivity___ and selects the matched option.

#Bonus

- Comes with a utility that can be used to find next and previous custom focusable element on the page with respect to a specific element. _Returns the element_
- Comes with a utility that returns a list of all focusable elements on the page in serial order (visible only). _Returns an Array_
