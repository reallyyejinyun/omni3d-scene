package com.omni3d.server.controller;

import com.omni3d.server.common.Result;
import com.omni3d.server.entity.LabelTemplate;
import com.omni3d.server.service.LabelTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/label-templates")
@RequiredArgsConstructor
@CrossOrigin
public class LabelTemplateController {

    private final LabelTemplateService labelTemplateService;

    @GetMapping
    public Result<List<LabelTemplate>> list() {
        return Result.success(labelTemplateService.list());
    }

    @GetMapping("/{id}")
    public Result<LabelTemplate> getById(@PathVariable Long id) {
        return Result.success(labelTemplateService.getById(id));
    }

    @PostMapping
    public Result<LabelTemplate> save(@RequestBody LabelTemplate template) {
        labelTemplateService.saveOrUpdate(template);
        return Result.success(template);
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(labelTemplateService.removeById(id));
    }
}
