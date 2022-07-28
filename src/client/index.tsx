import React from 'react';
import { createRoot } from 'react-dom/client';

import 'antd/dist/antd.css';
import {RequestsPage} from "./components/RequestsPage";

const root = createRoot(document.getElementById('root'));
root.render(<>
  <RequestsPage/>
</>);
