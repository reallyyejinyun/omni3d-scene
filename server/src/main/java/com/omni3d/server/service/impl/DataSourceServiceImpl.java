package com.omni3d.server.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.omni3d.server.entity.DataSource;
import com.omni3d.server.mapper.DataSourceMapper;
import com.omni3d.server.service.DataSourceService;
import org.springframework.stereotype.Service;

@Service
public class DataSourceServiceImpl extends ServiceImpl<DataSourceMapper, DataSource> implements DataSourceService {
}
