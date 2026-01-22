package com.omni3d.server.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("asset")
public class Asset {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String type; // model, texture, image

    private String url; // 资源地址

    private String thumbnail; // 缩略图地址

    private String categoryId; // 分类ID

    private Long size; // 文件大小

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
