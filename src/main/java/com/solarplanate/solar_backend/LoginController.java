package com.solarplanate.solar_backend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class LoginController {

    // Demo Admin Credentials
    private final String ADMIN_USERNAME = "admin";
    private final String ADMIN_PASSWORD = "admin123";


    // =====================================
    // Admin Login
    // =====================================

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody Map<String, String> loginData) {

        String username =
                loginData.get("username");

        String password =
                loginData.get("password");


        Map<String, Object> response =
                new HashMap<>();


        // Check credentials

        if (
                ADMIN_USERNAME.equals(username)
                &&
                ADMIN_PASSWORD.equals(password)
        ) {

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Login successful"
            );

            response.put(
                    "username",
                    username
            );

            response.put(
                    "role",
                    "ADMIN"
            );

        } else {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Invalid username or password"
            );

        }


        return response;
    }

}
