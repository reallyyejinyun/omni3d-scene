package com.omni3d.server;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.omni3d.server.mapper")
public class Omni3DApplication {

    public static void main(String[] args) {
        SpringApplication.run(Omni3DApplication.class, args);
    }

}
