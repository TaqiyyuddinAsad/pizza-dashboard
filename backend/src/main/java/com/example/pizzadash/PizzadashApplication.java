package com.example.pizzadash;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PizzadashApplication {

	public static void main(String[] args) {
		SpringApplication.run(PizzadashApplication.class, args);
	}

}
