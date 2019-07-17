import React from "react";
import ReactDOM from "react-dom";
// Initial Problem (see explanation in file)
import InitialProblem from "./initialProblem";
// Solution to Problem (see solution.js, useSynchedState.js)
import Solution from "./solution";

/* --- Explanation -------------------------------------- */

const Explanation = () => (
  <>
    <h1>useSynchedState() hook.</h1>
    <hr />
    <InitialProblem />
    <Solution />
  </>
);

/* --- React mount ------------------------------------------------------------------------------ */

const rootElement = document.getElementById("root");
ReactDOM.render(<Explanation />, rootElement);
