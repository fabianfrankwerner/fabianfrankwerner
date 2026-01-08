import { makeProject } from "@motion-canvas/core";

import one from "./scenes/one?scene";

import "./global.css";

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser } from "@lezer/javascript";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [one],
});
