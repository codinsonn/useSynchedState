# `useSynchedState()` - Custom React Hook

This codesandbox is both an attempt at finding a hook that can update state whenever props change as well as a search for a fix to a prop & state synching visual bug.

(scroll down for solution btw)

Before resorting to using the `useSynchedState` or `useStateWithCallback` hooks, please read this article by the React team first:

[You probably don't need derived state](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

## Custom React Hooks

`./src/hooks/usePrevious.js`

```javascript
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
```

and its usage in `./src/hooks/useSynchedState.js`

```javascript
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
```

and its usage in `./src/hooks/useStateWithCallback.js`

```javascript
const useStateWithCallback = (propValue, setStateCallback) => {
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
```
