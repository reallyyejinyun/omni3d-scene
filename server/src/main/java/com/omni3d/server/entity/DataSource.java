package com.omni3d.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("data_source")
public class DataSource {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String url;

    private String method;

    private String headers;

    private String params;

    private String config; // 存储解析后的 Tags 等配置

    private Integer refreshInterval;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
