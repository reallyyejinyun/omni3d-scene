package com.omni3d.server.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.omni3d.server.entity.Project;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface ProjectService extends IService<Project> {
    IPage<Project> getProjectPage(Page<Project> page, String name);

    String uploadThumbnail(Long id, MultipartFile file) throws IOException;
}
