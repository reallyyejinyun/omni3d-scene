# Omni3D Scene Editor | Omni3D 场景编辑器

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%2019-61dafb.svg)
![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js-black.svg)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203-6db33f.svg)

Omni3D 场景编辑器是基于 Web 的**3D 数字化孪生及可视化编辑器**。本项目采用前后端分离架构，旨在通过低代码的方式，帮助用户快速搭建、配置并集成复杂的 3D 场景，适用于智慧城市、工业监控、资产管理等多种数字化转型场景。

---

## 🚀 核心特性

### 1. 3D 编辑能力
*   **多资源支持**：支持 GLTF/GLB 模型、几何体（立方体、球体等）、灯光、CSS3D 标签、精灵图等多种场景对象。
*   **变换控制**：集成旋转、平移、缩放控制器，支持吸附功能，确保对象精准定位。
*   **场景图管理**：提供清晰的对象层级树结构，支持重命名、隐藏、锁定及模型内部组件深度解析。

### 2. 环境与后期处理
*   **真实感渲染**：支持 HDR 环境贴图、天空盒切换及曝光度调节。
*   **后期特效**：内置 Bloom（辉光）、SSAO（环境光遮蔽）、Vignette（晕影）、色调调整等高级后期效果。

### 3. 动态交互与动画系统
*   **路径规划 (Roaming)**：可视化编辑相机漫游路径，支持平滑飞行与节点停留时间配置。
*   **动画中心**：支持模型原生动画播放及自定义关键帧动画编辑，实现复杂的物体联动特效。
*   **事件编排**：内置点击、悬浮等交互事件监听，支持“触发器-动作”式的逻辑配置。

### 4. 业务数据集成 (Digital Twin)
*   **数据绑定**：支持将 3D 对象的颜色、位置、文本等属性与后端数据源实时绑定。
*   **标签模板引擎**：支持使用 HTML/CSS 自定义标签模板，并使用Mustache语法与业务数据无缝融合。
*   **数据源管理**：内置 API 数据源管理工具，支持自动刷新与数据扁平化解析。

---

## 🛠 技术栈

### 前端 (react-impl)
*   **核心框架**：React 19 + TypeScript
*   **3D 引擎**：Three.js + React Three Fiber (R3F) + @react-three/drei
*   **状态管理**：Zustand
*   **UI 组件库**：Ant Design 6
*   **样式处理**：TailwindCSS + CSS Modules
*   **代码编辑**：Monaco Editor (用于 HTML/CSS 标签编辑)

### 后端 (server)
*   **核心框架**：Spring Boot 3.2.2
*   **持久层**：MyBatis-Plus + MySQL
*   **文档**：SpringDoc OpenAPI (Swagger)
*   **实用工具**：Lombok

---

## 📂 项目结构

```text
omni3d-scene-editor/
├── react-impl/             # React 前端代码
│   ├── src/
│   │   ├── api/           # 接口声明
│   │   ├── components/    # 核心组件库 (Viewport, TemplateManager等)
│   │   ├── hooks/         # 自定义 Hook (初始化, 数据绑定, 预览等)
│   │   ├── store/         # Zustand 全局状态
│   │   ├── views/         # 页面视图 (项目中心, 资产管理等)
│   │   └── types.ts       # 全局类型定义
├── server/                 # Spring Boot 后端代码
│   ├── src/main/java/     # Java 源码
│   └── schema.sql         # 数据库初始化脚本
└── README.md               # 项目主文档
```

---

## 🏁 快速开始

### 1. 后端部署
1.  确保本地已安装 **Java 17** 和 **MySQL 8.x**。
2.  执行 `server/schema.sql` 中的脚本创建数据库。
3.  通过 Maven 运行后端服务：
    ```bash
    cd server
    mvn spring-boot:run
    ```

### 2. 前端部署
1.  进入前端目录：
    ```bash
    cd react-impl
    ```
2.  安装依赖：
    ```bash
    pnpm install
    ```
3.  启动开发服务：
    ```bash
    pnpm dev
    ```

---

## 🗺 路线图 (Roadmap)

*   [x] 核心编辑器 1.0 版本
*   [x] 后端标签模板持久化集成
*   [ ] 多人实时协同编辑系统
*   [ ] 场景运行时 (Runtime SDK) 导出
*   [ ] 节点式逻辑编排引擎 (Blueprints)

---

## 📄 开源许可

本项目采用 [MIT License](LICENSE) 许可。

---

> **Omni3D** - 让 3D 数字化孪生触手可及。 如果觉得本项目对你有帮助，欢迎给予一个 ⭐ Star！
