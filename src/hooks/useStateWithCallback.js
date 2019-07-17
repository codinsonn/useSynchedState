import { useEffect } from "react";
// Hooks
import useSynchedState from "./useSynchedState";
// Utils
import { deepMatch } from "../utils/deepMatch";

/* --- Helpers ------------------------------------------------------------------------------ */

const warnNoCallback = (...args) => {
  console.warn(
    "-!- [useStateWithCallback] Missing callback, state changed:",
    ...args
  );
};

/* --- useStateWithCallback() ------------------------------------------------------------------------------ */

const useStateWithCallback = (propValue, setStateCallback = warnNoCallback) => {
  // Synch State with Prop
  const [
    stateValue,
    setStateValue,
    prevValue,
    synchTriggered
  ] = useSynchedState(propValue);

  // Fire callback on setState (if provided)
  useEffect(() => {
    if (
      typeof prevValue !== "undefined" && // don't fire the effect by default on first render
      !synchTriggered && // don't fire when a synch from props was triggered (avoids loops)
      !deepMatch(stateValue, prevValue) // only fire when states don't match
    ) {
      setStateCallback(stateValue);
    }
  }, [stateValue, setStateCallback]); // eslint-disable-line react-hooks/exhaustive-deps
  // ^ Intentionally omit prevValue so effect only fires the callback when stateValue was changed

  // Return array with latest value, a state setter & its previous value
  return [
    // 0: latest value
    stateValue,
    // 1: state setter
    setStateValue,
    // 2: previous value
    prevValue
  ];
};

/* --- Export Custom Hook ------------------------------------------------------------------------------ */

export default useStateWithCallback;
