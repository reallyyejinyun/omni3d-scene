package com.omni3d.server.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.omni3d.server.entity.Project;
import com.omni3d.server.mapper.ProjectMapper;
import com.omni3d.server.service.ProjectService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements ProjectService {
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    @Override
    public IPage<Project> getProjectPage(Page<Project> page, String name) {
        LambdaQueryWrapper<Project> query = Wrappers.lambdaQuery();
        if (name != null && !name.isEmpty()) {
            query.like(Project::getName, name);
        }
        query.orderByDesc(Project::getUpdateTime);
        return this.page(page, query);
    }

    @Override
    public String uploadThumbnail(Long id, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        // 1. 获取旧的缩略图路径以便后续删除
        Project oldProject = this.getById(id);
        String oldThumbnail = oldProject != null ? oldProject.getThumbnail() : null;

        // 确保目录存在
        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();

        // 2. 保存新文件
        String originalFilename = file.getOriginalFilename();
        String suffix = originalFilename != null
                ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase()
                : ".png";
        String fileName = "project_" + id + "_" + UUID.randomUUID().toString().substring(0, 8) + suffix;
        Path path = Paths.get(uploadDir, fileName);
        file.transferTo(path);

        String url = "/uploads/" + fileName;

        // 3. 更新项目数据库记录
        Project project = new Project();
        project.setId(id);
        project.setThumbnail(url);
        this.updateById(project);

        // 4. 清理旧物理文件（仅处理 uploads 目录下的自定义封面）
        if (oldThumbnail != null && oldThumbnail.startsWith("/uploads/")) {
            String oldFileName = oldThumbnail.substring("/uploads/".length());
            File oldFile = new File(uploadDir + oldFileName);
            if (oldFile.exists() && oldFile.isFile()) {
                oldFile.delete();
            }
        }

        return url;
    }
}
