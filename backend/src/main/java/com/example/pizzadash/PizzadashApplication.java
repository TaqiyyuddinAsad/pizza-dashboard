package com.example.pizzadash;

import org.apache.catalina.core.ApplicationContext;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
public class PizzadashApplication {

	public static void main(String[] args) {
		SpringApplication.run(PizzadashApplication.class, args);
	}

	
}
