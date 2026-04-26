package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example")
public class FirebaseAuthBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FirebaseAuthBackendApplication.class, args);
	}
}