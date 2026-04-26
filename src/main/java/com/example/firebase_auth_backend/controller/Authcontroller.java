package com.example.firebase_auth_backend.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class Authcontroller {

    @PostMapping("/verify")
    public Map<String, Object> verifyToken(@RequestHeader("Authorization") String token) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Remove "Bearer "
            String idToken = token.replace("Bearer ", "");

            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

            response.put("uid", decodedToken.getUid());
            response.put("phone", decodedToken.getClaims().get("phone_number"));
            response.put("status", "success");

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }

        return response;
    }
}