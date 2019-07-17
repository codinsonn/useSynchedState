import React from "react";
// Hooks
import useStateWithCallback from "./hooks/useStateWithCallback";
// ^ useStateWithCallback uses useSynchedState internally
// import useSynchedState from "./hooks/useSynchedState";
// ^ which uses the usePrevious hook to compare prev props / state

/* --- <FormOption/> ------------------------------------------------------------------------------ */

const FormOption = props => {
  // Extract props
  const { type = "checkbox", lbl, name, value, id, onChange } = props;

  // State (with callback, uses useSynchedState internally)
  const [checked, setChecked] = useStateWithCallback(
    typeof value === "boolean" ? value : props.checked,
    onChange // callback
  ); // ^ fires callback when state changes

  // Render
  return (
    <div key={id}>
      <label htmlFor={id} className="form-check-label">
        <span className={`input${checked ? " checked" : ""}`}>
          <input
            type={type}
            name={name}
            checked={checked}
            id={id}
            value={value}
            // Triggers onChange callback passed to useStateWithCallback
            // (which uses useSynchedState internally...)
            // (... to update state when props change)
            onChange={e => setChecked(e.currentTarget.checked)}
          />
        </span>
        {` ${lbl}`}
      </label>
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

  // State (with callback)
  const [value, setValue] = useStateWithCallback(props.value, onChange); // fires callback when state changes

  // Choice ordering
  const orderedChoices = choiceOrder || Object.keys(choices);

  // Render
  return (
    <div>
      {orderedChoices.map(choice => (
        <FormOption
          // -!- SOLUTION: -!-
          // Return new instance when value changes by invalidating key
          // -> This also triggers props & state synch in the process
          key={`radio-solution-${choice}-${value}`}
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

/* --- Export & Explain Solution -------------------------- */

const Solution = () => (
  <div>
    <h2>Solution:</h2>
    <h3>
      Invalidating key to return new FormOption instance when value changes.
    </h3>
    <p>The code that solved the initial problem is found in:</p>
    <ul>
      <li>solution.js (on line 71)</li>
    </ul>
    <p>But a refactor, split & simplification has also been done of:</p>
    <ul>
      <li>usePrevious.js</li>
      <li>useSynchedState.js</li>
      <li>useStateWithCallback.js</li>
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
