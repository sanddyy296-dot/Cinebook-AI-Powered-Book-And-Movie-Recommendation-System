# CineBook AI — AI-Powered Book and Movie Recommendation System

**College Mini-Project Deliverable**
- **Student Name:** Ukeshwari S. (ukeshwari15@gmail.com)
- **Architecture:** Java 21, Spring Boot 3.3.4, Spring Data JPA, Hibernate, MySQL 8, Spring Security 6, Thymeleaf, Google Gemini API

---

## 🌟 Project Overview
CineBook AI is a unified recommendation and discovery web application designed to bridge literature and cinema. The system integrates multilingual cataloguing (English, Tamil, Hindi, Telugu, Malayalam, Bengali, Japanese, etc.), user-specific preference profiles, interactive wishlists, community reviews, and an explainable hybrid recommendation algorithm.

---

## 🛠️ Mandatory Technology Stack
* **Language:** Java 21 LTS
* **Framework:** Spring Boot 3.3.4 (Spring MVC, Thymeleaf)
* **Build System:** Apache Maven 3.9+
* **Persistence:** Spring Data JPA, Hibernate 6.x
* **Database:** MySQL Server 8.0 (UTF-8 Unicode `utf8mb4_unicode_ci`)
* **Database Migrations:** Flyway 10.x
* **Security:** Spring Security 6, BCrypt Password Hashing, CSRF Protection
* **Documentation:** Springdoc OpenAPI / Swagger UI
* **Testing:** JUnit 5, Spring Boot Test
* **AI Service:** Google Gemini 2.5 Flash API

---

## 🚀 Step-by-Step Local Setup Guide

### 1. Prerequisites
Ensure you have installed:
1. **Java JDK 21+**: Verify by running `java -version`
2. **Maven 3.9+**: Verify by running `mvn -version`
3. **MySQL 8.0**: Verify by running `mysql -u root -p`

### 2. Database Creation
In your MySQL terminal or MySQL Workbench, execute:
```sql
CREATE DATABASE cinebook_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure Database Credentials
Edit `src/main/resources/application.properties` or set environment variables:
```bash
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
```

### 4. Build and Execute Application
```bash
# Navigate to the backend folder
cd cinebook-ai-backend

# Clean compile and install dependencies
mvn clean install

# Launch Spring Boot
mvn spring-boot:run
```

Once launched:
* **Web Portal:** `http://localhost:8080`
* **Swagger API Documentation:** `http://localhost:8080/swagger-ui.html`
* **Default Admin Account:** `admin` / `Admin@123`
* **Default Student Account:** `cinebook_student` / `Student@123`

---

## 🧠 Recommendation Engine Architecture

### A. Content-Based Filtering
Computes Jaccard Similarity between user's preferred genres and item genres:
$$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
Applies positive weighting (+25%) for native/translated language alignment and affinity with favorite authors/directors.

### B. Bayesian Weighted Rating
Protects against low-sample rating distortion (e.g. a title with one 5-star review outranking an established title with 25,000 ratings at 4.8 stars):
$$WR = \left(\frac{v}{v+m}\right) \cdot R + \left(\frac{m}{v+m}\right) \cdot C$$
* $v$: Total vote count
* $m$: Minimum vote threshold (1,000)
* $R$: Item average rating
* $C$: Mean rating across all catalog items (4.5)

### C. Hybrid Combination
$$Score = (w_{content} \times ContentScore) + (w_{popularity} \times PopularityScore)$$
Default configuration: $w_{content} = 0.65$, $w_{popularity} = 0.35$ ($w_{content} + w_{popularity} = 1.0$).
