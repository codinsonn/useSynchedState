import React, { Fragment } from "react";
// Hooks
import useStateWithCallback from "./hooks/useStateWithCallback";
// ^ useStateWithCallback uses useSynchedState internally
// import useSynchedState from "./hooks/useSynchedState";
// ^ which uses the usePrevious hook to compare prev props / state

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
  const [checked, setChecked] = useStateWithCallback(props.checked, onChange); // synchs prop & state values

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
      // (which uses useSynchedState internally...)
      // (... to update state when props change)
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

export const FormRadioList = props => {
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
  const [value, setValue] = useStateWithCallback(props.value, onChange); // synchs prop & state values

  // Choice ordering
  const orderedChoices = choiceOrder || Object.keys(choices);

  // Render
  return (
    <div>
      {orderedChoices.map(choice => (
        <FormOption
          key={`radio-solution-${choice}`}
          id={`radio-solution-${choice}`}
          type="radio"
          name={name}
          value={choice}
          checked={value === choice}
          lbl={choices[choice]}
          disabled={disabled}
          readOnly={readOnly}
          isCustom={isCustom}
          // Triggers onChange callback passed to useStateWithCallback
          // (which uses useSynchedState internally...)
          // (... to update state when props change)
          onChange={val => {
            if (val) setValue(choice);
          }}
        />
      ))}
    </div>
  );
};

/* --- Export & Explain Initial Problem -------------------------- */

const Solution = () => (
  <div>
    <h2>Solution:</h2>
    <h3>Refactor useSynchedState to behave more like componentDidUpdate</h3>
    <p>The code that solved the initial problem is found in:</p>
    <ul>
      <li>hooks/useSynchedState.js (hook)</li>
      <li>solution.js (application)</li>
    </ul>
    <p>Try checking a different option a bunch of times now:</p>
    <FormRadioList
      choiceOrder={["firstchoice", "secondchoice", "thirdchoice"]}
      choices={{
        firstchoice: "First Choice",
        secondchoice: "Second Choice",
        thirdchoice: "Third Choice"
      }}
      name="someradiolist"
      disabled={false}
      readOnly={false}
      isCustom={false}
      onChange={choice => console.log("Solution choice changed:", choice)}
    />
    <br />
    <hr />
  </div>
);

export default Solution;
