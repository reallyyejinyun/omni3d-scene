package com.omni3d.server.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.omni3d.server.entity.Asset;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AssetMapper extends BaseMapper<Asset> {
}
