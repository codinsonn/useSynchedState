import { useEffect, useRef } from "react";

/* --- usePrevious() ------------------------------------------------------------------------------ */

const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref (Updates AFTER renders or reconciliations)
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (since actual update only happens after render due to effect)
  return ref.current;
};

/* --- Export Custom Hook ------------------------------------------------------------------------------ */

export default usePrevious;
