package com.omni3d.server.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.omni3d.server.entity.Asset;
import com.omni3d.server.mapper.AssetMapper;
import com.omni3d.server.service.AssetService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.UUID;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

@Service
public class AssetServiceImpl extends ServiceImpl<AssetMapper, Asset> implements AssetService {

    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    @Override
    public IPage<Asset> getAssetPage(Page<Asset> page, String name, String categoryId) {
        LambdaQueryWrapper<Asset> query = Wrappers.lambdaQuery();
        if (name != null && !name.isEmpty()) {
            query.like(Asset::getName, name);
        }
        if (categoryId != null && !categoryId.isEmpty() && !"all".equals(categoryId)) {
            query.eq(Asset::getCategoryId, categoryId);
        }
        query.orderByDesc(Asset::getCreateTime);
        return this.page(page, query);
    }

    @Override
    public Asset uploadAsset(MultipartFile file, MultipartFile thumbnail, String name, String category)
            throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        // 确保目录存在
        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();

        // 保存主资产文件
        String originalFilename = file.getOriginalFilename();
        String suffix = originalFilename != null
                ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase()
                : "";
        String fileName = UUID.randomUUID().toString() + suffix;
        Path path = Paths.get(uploadDir, fileName);
        file.transferTo(path);

        // 创建实体
        Asset asset = new Asset();
        asset.setName(name);
        asset.setCategoryId(category);
        asset.setUrl("/uploads/" + fileName);
        asset.setType(determineType(suffix));
        asset.setSize(file.getSize());

        // 如果提供了缩略图，则保存缩略图
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String thumbOriginalFilename = thumbnail.getOriginalFilename();
            String thumbSuffix = thumbOriginalFilename != null
                    ? thumbOriginalFilename.substring(thumbOriginalFilename.lastIndexOf(".")).toLowerCase()
                    : ".png";
            String thumbFileName = "thumb_" + UUID.randomUUID().toString() + thumbSuffix;
            Path thumbPath = Paths.get(uploadDir, thumbFileName);
            thumbnail.transferTo(thumbPath);
            asset.setThumbnail("/uploads/" + thumbFileName);
        }

        this.save(asset);
        return asset;
    }

    private String determineType(String suffix) {
        if (Arrays.asList(".gltf", ".glb", ".obj", ".fbx", ".stl").contains(suffix)) {
            return "model";
        } else if (Arrays.asList(".jpg", ".jpeg", ".png", ".webp", ".gif").contains(suffix)) {
            return "image";
        } else if (Arrays.asList(".mp4", ".webm", ".mov").contains(suffix)) {
            return "video";
        } else if (Arrays.asList(".hdr", ".exr").contains(suffix)) {
            return "hdr";
        }
        return "other";
    }
}
