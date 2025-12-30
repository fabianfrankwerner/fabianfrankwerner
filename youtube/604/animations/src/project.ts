import { makeProject } from "@motion-canvas/core";

import oneOne from "./scenes/oneOne?scene";

import "./global.css";

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser } from "@lezer/python";

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [oneOne],
});
