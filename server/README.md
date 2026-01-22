# Omni3D Scene Editor Backend

基于 Spring Boot 3 + MyBatis Plus + MySQL 的后端项目。

## 技术栈
- **核心框架**: Spring Boot 3.2.2
- **ORM 框架**: MyBatis Plus 3.5.5
- **数据库**: MySQL 8.0+
- **工具库**: Lombok, SpringDoc (Swagger)
- **Java 版本**: 17+

## 快速开始

### 1. 数据库初始化
请先在本地 MySQL 中运行 `server/schema.sql` 脚本，初始化数据库结构。

### 2. 配置修改
在 `src/main/resources/application.yml` 中检查数据库连接配置：
- `url`: `jdbc:mysql://localhost:3306/omni3d`
- `username`: `root`
- `password`: `123456`

### 3. 运行
使用 IDE (IntelliJ IDEA / VS Code) 运行 `Omni3DApplication.java`。
或者使用命令行：
```bash
mvn spring-boot:run
```

## API 文档
项目启动后，访问以下地址查看 Swagger 文档：
http://localhost:8080/swagger-ui/index.html
