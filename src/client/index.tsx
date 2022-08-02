import React from "react";
import { createRoot } from "react-dom/client";

import "antd/dist/antd.css";
import { App } from "./components/App";

const root = createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
  </>
);
