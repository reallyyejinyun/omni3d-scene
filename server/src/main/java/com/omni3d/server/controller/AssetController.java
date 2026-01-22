package com.omni3d.server.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.omni3d.server.common.Result;
import com.omni3d.server.entity.Asset;
import com.omni3d.server.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@CrossOrigin
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public Result<IPage<Asset>> list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "12") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String categoryId) {
        Page<Asset> page = new Page<>(current, size);
        return Result.success(assetService.getAssetPage(page, name, categoryId));
    }

    @PostMapping("/upload")
    public Result<Asset> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam("name") String name,
            @RequestParam("categoryId") String categoryId) {
        try {
            Asset asset = assetService.uploadAsset(file, thumbnail, name, categoryId);
            return Result.success(asset);
        } catch (IOException e) {
            return Result.error("文件上传失败: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public Result<Boolean> update(
            @PathVariable Long id,
            @RequestPart("asset") Asset asset,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) throws IOException {
        asset.setId(id);

        if (thumbnail != null && !thumbnail.isEmpty()) {
            // 保存新封面（复用 uploadAsset 中的部分逻辑或由 Service 处理）
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            String originalFilename = thumbnail.getOriginalFilename();
            String suffix = originalFilename != null
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase()
                    : ".png";
            String fileName = "thumb_" + UUID.randomUUID().toString() + suffix;
            thumbnail.transferTo(new java.io.File(uploadDir + fileName));
            asset.setThumbnail("/uploads/" + fileName);
        }

        return Result.success(assetService.updateById(asset));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(assetService.removeById(id));
    }
}
