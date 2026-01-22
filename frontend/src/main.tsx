import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);

  // 渲染根组件
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
