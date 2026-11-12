package com.cinebookai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CineBook AI - AI-Powered Book and Movie Recommendation System
 * College Mini-Project Architecture
 *
 * @author Ukeshwari S.
 * @version 1.0.0
 */
@SpringBootApplication
public class CineBookAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CineBookAiApplication.class, args);
        System.out.println("==================================================");
        System.out.println("CineBook AI successfully started on port 8080!");
        System.out.println("Web Portal: http://localhost:8080");
        System.out.println("Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println("==================================================");
    }
}
