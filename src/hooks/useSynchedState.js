import { useEffect, useState } from "react";
// Hooks
import usePrevious from "./usePrevious";
// Utils
import { deepMatch } from "../utils/deepMatch";

/* --- useSynchedState() ------------------------------------------------------------------------------ */

const useSynchedState = prop => {
  // State
  const [state, setState] = useState(prop);

  // Remember previous state & props
  const prevState = usePrevious(state);
  const prevProp = usePrevious(prop);

  // Flags
  const propsDiffer = !deepMatch(prop, prevProp);
  const statesMatch = deepMatch(state, prevState);
  const inSynch = deepMatch(state, prop);
  const shouldSynch = propsDiffer && statesMatch && !inSynch;
  const synchTriggered = usePrevious(shouldSynch); // This flag can avoid loops with callbacks

  // Update the state value from props whenever props changes
  useEffect(() => {
    if (shouldSynch) setState(prop);
  }, [prop]); // eslint-disable-line react-hooks/exhaustive-deps
  // ^ Intentionally omit state & prevState from dependencies so the effect is only run on prop change

  // Return array with latest value, a state setter & its previous value
  return [
    // 0: latest value
    state,
    // 1: state setter
    setState,
    // 2: previous value
    prevState,
    // 3: synch triggered?
    shouldSynch || synchTriggered
  ];
};

/* --- Export Custom Hook ------------------------------------------------------------------------------ */

export default useSynchedState;
