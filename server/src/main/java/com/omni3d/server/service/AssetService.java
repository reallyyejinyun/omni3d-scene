package com.omni3d.server.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.omni3d.server.entity.Asset;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface AssetService extends IService<Asset> {
    Asset uploadAsset(MultipartFile file, MultipartFile thumbnail, String name, String categoryId) throws IOException;

    IPage<Asset> getAssetPage(Page<Asset> page, String name, String categoryId);
}
