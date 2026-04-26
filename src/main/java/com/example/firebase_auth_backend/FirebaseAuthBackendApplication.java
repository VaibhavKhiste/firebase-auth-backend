package com.example.firebase_auth_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example")
public class FirebaseAuthBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FirebaseAuthBackendApplication.class, args);
	}
}