import { makeProject } from "@motion-canvas/core";

import six from "./scenes/six?scene";

import "./global.css";

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser } from "@lezer/python";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [six],
});
