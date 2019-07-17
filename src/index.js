import React from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";
// Initial Problem (see explanation in file)
import InitialProblem from "./initialProblem";
// Solution to Problem (see solution.js, useSynchedState.js)
import Solution from "./solution";
// Readme
import README from "../README.md";

/* --- Markdown CodeBlocks ---------------------------------------- */

const CodeBlock = ({ language, value }) => (
  <SyntaxHighlighter language={language} style={monokaiSublime}>
    {value}
  </SyntaxHighlighter>
);

/* --- Explanation -------------------------------------- */

const Explanation = () => (
  <>
    <ReactMarkdown
      className="markdown markdown-body"
      source={README}
      renderers={{ code: CodeBlock }}
    />
    <br />
    <hr />
    <InitialProblem />
    <Solution />
  </>
);

/* --- React mount ------------------------------------------------------------------------------ */

const rootElement = document.getElementById("root");
ReactDOM.render(<Explanation />, rootElement);
