package com.omni3d.server.controller;

import com.omni3d.server.common.Result;
import com.omni3d.server.entity.DataSource;
import com.omni3d.server.service.DataSourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data-sources")
@CrossOrigin
public class DataSourceController {

    @Autowired
    private DataSourceService dataSourceService;

    @GetMapping
    public Result<List<DataSource>> list() {
        return Result.success(dataSourceService.list());
    }

    @GetMapping("/{id}")
    public Result<DataSource> getById(@PathVariable Long id) {
        return Result.success(dataSourceService.getById(id));
    }

    @PostMapping
    public Result<Boolean> save(@RequestBody DataSource dataSource) {
        return Result.success(dataSourceService.save(dataSource));
    }

    @PutMapping
    public Result<Boolean> update(@RequestBody DataSource dataSource) {
        return Result.success(dataSourceService.updateById(dataSource));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(dataSourceService.removeById(id));
    }
}
