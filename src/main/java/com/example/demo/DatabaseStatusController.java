package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;
import java.sql.Connection;

@RestController
public class DatabaseStatusController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/database-status")
    public String checkDatabaseStatus() {
        try (Connection connection = dataSource.getConnection()) {
            return "Database connection is successful!";
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
}
