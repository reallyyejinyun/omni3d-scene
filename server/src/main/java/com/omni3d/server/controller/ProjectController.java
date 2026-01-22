package com.omni3d.server.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.omni3d.server.common.Result;
import com.omni3d.server.entity.Project;
import com.omni3d.server.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin // 允许跨域
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public Result<IPage<Project>> list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "12") Integer size,
            @RequestParam(required = false) String name) {
        Page<Project> page = new Page<>(current, size);
        return Result.success(projectService.getProjectPage(page, name));
    }

    @PostMapping
    public Result<Boolean> save(@RequestBody Project project) {
        return Result.success(projectService.save(project));
    }

    @PutMapping("/{id}")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody Project project) {
        project.setId(id);
        return Result.success(projectService.updateById(project));
    }

    @PostMapping("/{id}/thumbnail")
    public Result<String> uploadThumbnail(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            return Result.success(projectService.uploadThumbnail(id, file));
        } catch (IOException e) {
            return Result.error("缩略图上传失败: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result<Project> getById(@PathVariable Long id) {
        return Result.success(projectService.getById(id));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(projectService.removeById(id));
    }
}
