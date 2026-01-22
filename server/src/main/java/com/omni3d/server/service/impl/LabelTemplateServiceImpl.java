package com.omni3d.server.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.omni3d.server.entity.LabelTemplate;
import com.omni3d.server.mapper.LabelTemplateMapper;
import com.omni3d.server.service.LabelTemplateService;
import org.springframework.stereotype.Service;

@Service
public class LabelTemplateServiceImpl extends ServiceImpl<LabelTemplateMapper, LabelTemplate> implements LabelTemplateService {
}
