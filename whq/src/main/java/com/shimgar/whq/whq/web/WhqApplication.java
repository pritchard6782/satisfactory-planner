package com.shimgar.whq.whq.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@ComponentScan("com.shimgar.whq")
@EnableJpaRepositories("com.shimgar.whq")
@EntityScan("com.shimgar.whq")
@SpringBootApplication
public class WhqApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhqApplication.class, args);
	}
}
