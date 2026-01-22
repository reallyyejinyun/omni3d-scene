package com.omni3d.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("label_template")
public class LabelTemplate {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String html;

    private String css;

    private String fields; // 逗号分隔

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
