package com.convene.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class ConveneApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConveneApiApplication.class, args);
    }
}
