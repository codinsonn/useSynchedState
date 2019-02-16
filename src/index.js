import React, { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";

// PROBLEM: 'checked' property on radio buttons tends to get out of sync...
// ...with react-dom (where the props are correct according to devtools)
// More info & screenshots: https://github.com/facebook/react/issues/3005#issuecomment-463240372

/* --- useStateWithCallback ------------------------------------------------------------------------------ */
// Updates state when prop value changes

const useStateWithCallback = (initialValue, setStateCallback = null) => {
  // State
  const [stateValue, setStateValue] = useState(initialValue);

  // Fire callback on setState (if provided)
  useEffect(
    () => {
      if (setStateCallback && typeof setStateCallback === "function") {
        setStateCallback(stateValue);
      }
    },
    [stateValue] // Only fire callback when stateValue was changed
  );

  // Return array with latest value + state setter
  return [
    // 0: latest value
    stateValue,
    // 1: state setter
    setStateValue
  ];
};

/* --- <FormOption/> ------------------------------------------------------------------------------ */

const FormOption = props => {
  // Extract props
  const {
    type = "checkbox",
    lbl,
    name,
    value,
    id,
    disabled,
    readOnly,
    onChange,
    isCustom
  } = props;

  // Synched State
  const [checked, setChecked] = useStateWithCallback(props.checked, onChange);

  // OptionJSX: checkbox / radiobutton
  const OptionJSX = (
    <input
      type={type}
      name={name}
      checked={checked}
      id={id}
      className={isCustom ? "custom-control-input" : "form-check-input"}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      // Triggers onChange callback passed to useStateWithCallback
      onChange={e => setChecked(e.currentTarget.checked)}
    />
  );

  // Render
  return (
    <div
      className={isCustom ? `custom-control custom-${type}` : "form-check"}
      key={id}
    >
      {isCustom ? (
        <Fragment>
          {OptionJSX}
          <label htmlFor={id} className="custom-control-label">
            {lbl}
          </label>
        </Fragment>
      ) : (
        <label htmlFor={id} className="form-check-label">
          <span className={`input${checked ? " checked" : ""}`}>
            {OptionJSX}
          </span>
          {` ${lbl}`}
        </label>
      )}
    </div>
  );
};

/* --- <FormRadioList/> ------------------------------------------------------------------------------ */

const FormRadioList = props => {
  // Extract props
  const {
    choiceOrder,
    choices,
    name,
    disabled,
    readOnly,
    isCustom,
    onChange
  } = props;

  // Synched State
  const [value, setValue] = useStateWithCallback(props.value, onChange);

  // Choice ordering
  const orderedChoices = choiceOrder || Object.keys(choices);

  // Render
  return (
    <div>
      {orderedChoices.map(choice => (
        <FormOption
          // FIX: Invalidating the key when value updates returns new instance:
          // -> thus synching props with local state either way
          key={`radio-${choice}-${value}`} // FIX: added "-${value}"
          id={`radio-${choice}`}
          type="radio"
          name={name}
          value={choice}
          checked={value === choice}
          lbl={choices[choice]}
          disabled={disabled}
          readOnly={readOnly}
          isCustom={isCustom}
          // Triggers onChange callback passed to useStateWithCallback
          onChange={val => {
            if (val) setValue(choice);
          }}
        />
      ))}
    </div>
  );
};

/* --- React mount ------------------------------------------------------------------------------ */

const rootElement = document.getElementById("root");
ReactDOM.render(
  <FormRadioList
    choiceOrder={["firstchoice", "secondchoice", "thirdchoice"]}
    choices={{
      firstchoice: "First Choice",
      secondchoice: "Second Choice",
      thirdchoice: "Third Choice"
    }}
    name="someradiolist"
    value="secondchoice"
    disabled={false}
    readOnly={false}
    isCustom={false}
    onChange={null}
  />,
  rootElement
);
