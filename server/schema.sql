CREATE DATABASE IF NOT EXISTS omni3d DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE omni3d;

-- 项目表
CREATE TABLE IF NOT EXISTS `project` (
    `id` BIGINT AUTO_INCREMENT COMMENT '主键ID',
    `name` VARCHAR(100) NOT NULL COMMENT '项目名称',
    `description` TEXT COMMENT '项目描述',
    `thumbnail` VARCHAR(255) COMMENT '缩略图地址',
    `status` VARCHAR(20) DEFAULT 'draft' COMMENT '状态: draft, published',
    `tags` VARCHAR(255) COMMENT '标签',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目表';

-- 资产表 (素材)
CREATE TABLE IF NOT EXISTS `asset` (
    `id` BIGINT AUTO_INCREMENT COMMENT '主键ID',
    `name` VARCHAR(100) NOT NULL COMMENT '素材名称',
    `type` VARCHAR(50) COMMENT '类型: model, texture, image',
    `url` VARCHAR(255) NOT NULL COMMENT '资源地址',
    `thumbnail` VARCHAR(255) COMMENT '缩略图地址',
    `category_id` VARCHAR(50) COMMENT '分类ID',
    `size` BIGINT COMMENT '文件大小',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='素材表';

-- 数据源表
CREATE TABLE IF NOT EXISTS `data_source` (
    `id` BIGINT AUTO_INCREMENT COMMENT '主键ID',
    `name` VARCHAR(100) NOT NULL COMMENT '数据源名称',
    `url` VARCHAR(255) NOT NULL COMMENT '接口地址',
    `method` VARCHAR(10) DEFAULT 'GET' COMMENT '请求方式',
    `headers` TEXT COMMENT '请求头(JSON)',
    `params` TEXT COMMENT '请求参数(JSON)',
    `config` TEXT COMMENT '解析配置(JSON, 包含生成的Tags)',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据源表';
-- 标签模板表
CREATE TABLE IF NOT EXISTS `label_template` (
    `id` BIGINT AUTO_INCREMENT COMMENT '主键ID',
    `name` VARCHAR(100) NOT NULL COMMENT '模板名称',
    `html` TEXT COMMENT 'HTML结构',
    `css` TEXT COMMENT 'CSS样式',
    `fields` VARCHAR(255) COMMENT '暴露字段(逗号分隔)',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签模板表';
