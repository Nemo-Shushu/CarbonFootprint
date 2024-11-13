package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Allow unrestricted access to all endpoints
            .authorizeHttpRequests(authz -> authz.anyRequest().permitAll())
            // Disable CSRF for testing purposes (not recommended for production)
            .csrf(csrf -> csrf.disable())
            // Allow H2 console to be displayed in frames
            .headers(headers -> headers.frameOptions().disable());
        
        return http.build();
    }
}


