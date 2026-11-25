package com.coffeecraft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.coffeecraft.model")
@EnableJpaRepositories(basePackages = "com.coffeecraft.repository")
public class CoffeeCraftApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoffeeCraftApplication.class, args);
    }
}
