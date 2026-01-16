import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";

// 错误处理（仅在开发环境）
if (import.meta.env.DEV) {
  window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的 Promise 拒绝:', event.reason);
  });
}

// 检查根元素
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('找不到 root 元素！');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">错误：找不到 root 元素</div>';
} else {
  // 生产环境不使用 StrictMode 以提升性能
  const RootComponent = import.meta.env.DEV ? (
    <AppWrapper>
      <App />
    </AppWrapper>
  ) : (
    <AppWrapper>
      <App />
    </AppWrapper>
  );
  
  createRoot(rootElement).render(RootComponent);
}
