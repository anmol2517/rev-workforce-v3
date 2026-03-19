package com.revworkforce.performance;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@ComponentScan(basePackages = {"com.revworkforce.performance", "com.revworkforce.common"})
public class PerformanceServiceApplication {
    public static void main(String[] args) { SpringApplication.run(PerformanceServiceApplication.class, args); }
}

