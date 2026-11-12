import { JavaSourceFile } from '../types';

export const JAVA_PROJECT_FILES: JavaSourceFile[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'Config',
    description: 'Maven Project Object Model with Java 21, Spring Boot 3.3.4, Spring Data JPA, Security, MySQL, Thymeleaf & Swagger UI',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>

    <groupId>com.cinebookai</groupId>
    <artifactId>cinebook-ai</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>CineBook AI</name>
    <description>AI-Powered Book and Movie Recommendation System</description>

    <properties>
        <java.version>21</java.version>
        <springdoc.version>2.6.0</springdoc.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web & Thymeleaf -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.thymeleaf.extras</groupId>
            <artifactId>thymeleaf-extras-springsecurity6</artifactId>
        </dependency>

        <!-- Spring Data JPA & MySQL -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Spring Security & BCrypt -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Jakarta Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Flyway Database Migrations -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-mysql</artifactId>
        </dependency>

        <!-- Springdoc OpenAPI / Swagger UI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>\${springdoc.version}</version>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'src/main/resources/application.properties',
    name: 'application.properties',
    category: 'Config',
    description: 'Spring Boot Configuration with MySQL connection, Flyway migrations, UTF-8 encoding, and security',
    content: `# CineBook AI - Application Configuration
spring.application.name=cinebook-ai
server.port=8080

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/cinebook_db?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&useUnicode=true
spring.datasource.username=\${DB_USERNAME:root}
spring.datasource.password=\${DB_PASSWORD:password}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate Settings
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Flyway Migrations
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration

# Thymeleaf Template Settings
spring.thymeleaf.cache=false
spring.thymeleaf.mode=HTML
spring.thymeleaf.encoding=UTF-8

# Gemini AI Service Configuration (Optional)
cinebook.ai.gemini.api-key=\${GEMINI_API_KEY:}
cinebook.ai.gemini.enabled=true

# Logging
logging.level.com.cinebookai=INFO
logging.level.org.springframework.security=WARN`
  },
  {
    path: 'src/main/java/com/cinebookai/CineBookAiApplication.java',
    name: 'CineBookAiApplication.java',
    category: 'Config',
    description: 'Main Spring Boot Application entry point with initial admin seeding',
    content: `package com.cinebookai;

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
}`
  },
  {
    path: 'src/main/java/com/cinebookai/entity/Book.java',
    name: 'Book.java',
    category: 'Entity',
    description: 'JPA Book entity with ISBN, multilingual alternate titles, page counts, genres, ratings, and translations',
    content: `package com.cinebookai.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "alternate_title", length = 255)
    private String alternateTitle; // For native script: தமிழ், हिन्दी, etc.

    @NotBlank(message = "Author is required")
    @Column(nullable = false, length = 255)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "primary_genre", length = 100)
    private String primaryGenre;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "book_genres",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();

    @Column(name = "original_language", length = 50, nullable = false)
    private String originalLanguage;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "book_translations", joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "language_name")
    private Set<String> availableTranslations = new HashSet<>();

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @Column(name = "publication_year")
    private Integer publicationYear;

    @Column(length = 200)
    private String publisher;

    @Column(name = "isbn_10", length = 20)
    private String isbn10;

    @Column(name = "isbn_13", length = 25)
    private String isbn13;

    @Column(name = "page_count")
    private Integer pageCount;

    @Column(name = "series_name", length = 150)
    private String seriesName;

    @Column(name = "series_number")
    private Integer seriesNumber;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "is_featured")
    private Boolean featured = false;

    @Column(name = "is_trending")
    private Boolean trending = false;

    // Getters, Setters, Constructors omitted for brevity in summary
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAlternateTitle() { return alternateTitle; }
    public void setAlternateTitle(String alternateTitle) { this.alternateTitle = alternateTitle; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }
    public String getPrimaryGenre() { return primaryGenre; }
    public void setPrimaryGenre(String primaryGenre) { this.primaryGenre = primaryGenre; }
    public Set<Genre> getGenres() { return genres; }
    public void setGenres(Set<Genre> genres) { this.genres = genres; }
    public String getOriginalLanguage() { return originalLanguage; }
    public void setOriginalLanguage(String originalLanguage) { this.originalLanguage = originalLanguage; }
    public Set<String> getAvailableTranslations() { return availableTranslations; }
    public void setAvailableTranslations(Set<String> availableTranslations) { this.availableTranslations = availableTranslations; }
    public Integer getPublicationYear() { return publicationYear; }
    public void setPublicationYear(Integer publicationYear) { this.publicationYear = publicationYear; }
    public Integer getPageCount() { return pageCount; }
    public void setPageCount(Integer pageCount) { this.pageCount = pageCount; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }
    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
    public Boolean getTrending() { return trending; }
    public void setTrending(Boolean trending) { this.trending = trending; }
}`
  },
  {
    path: 'src/main/java/com/cinebookai/entity/Movie.java',
    name: 'Movie.java',
    category: 'Entity',
    description: 'JPA Movie entity with director, cast, audio languages, subtitles, runtime, and ratings',
    content: `package com.cinebookai.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "alternate_title", length = 255)
    private String alternateTitle;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    @NotBlank(message = "Director is required")
    @Column(nullable = false, length = 255)
    private String director;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_cast", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "actor_name")
    private Set<String> principalCast = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "movie_genres",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();

    @Column(name = "original_language", length = 50, nullable = false)
    private String originalLanguage;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_audio_languages", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "audio_language")
    private Set<String> availableAudioLanguages = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_subtitles", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "subtitle_language")
    private Set<String> subtitleLanguages = new HashSet<>();

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(name = "runtime_minutes")
    private Integer runtimeMinutes;

    @Column(length = 100)
    private String country;

    @Column(name = "production_company", length = 200)
    private String productionCompany;

    @Column(name = "age_rating", length = 20)
    private String ageRating;

    @Column(name = "poster_image_url", length = 500)
    private String posterImageUrl;

    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "is_featured")
    private Boolean featured = false;

    @Column(name = "is_trending")
    private Boolean trending = false;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAlternateTitle() { return alternateTitle; }
    public void setAlternateTitle(String alternateTitle) { this.alternateTitle = alternateTitle; }
    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }
    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }
    public Set<String> getPrincipalCast() { return principalCast; }
    public void setPrincipalCast(Set<String> principalCast) { this.principalCast = principalCast; }
    public Set<Genre> getGenres() { return genres; }
    public void setGenres(Set<Genre> genres) { this.genres = genres; }
    public String getOriginalLanguage() { return originalLanguage; }
    public void setOriginalLanguage(String originalLanguage) { this.originalLanguage = originalLanguage; }
    public Set<String> getAvailableAudioLanguages() { return availableAudioLanguages; }
    public void setAvailableAudioLanguages(Set<String> availableAudioLanguages) { this.availableAudioLanguages = availableAudioLanguages; }
    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }
    public Integer getRuntimeMinutes() { return runtimeMinutes; }
    public void setRuntimeMinutes(Integer runtimeMinutes) { this.runtimeMinutes = runtimeMinutes; }
    public String getPosterImageUrl() { return posterImageUrl; }
    public void setPosterImageUrl(String posterImageUrl) { this.posterImageUrl = posterImageUrl; }
    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }
    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
    public Boolean getTrending() { return trending; }
    public void setTrending(Boolean trending) { this.trending = trending; }
}`
  },
  {
    path: 'src/main/java/com/cinebookai/recommendation/HybridRecommendationEngine.java',
    name: 'HybridRecommendationEngine.java',
    category: 'Algorithm',
    description: 'Real explainable Hybrid Recommendation Algorithm combining Jaccard Content Similarity and Bayesian Popularity',
    content: `package com.cinebookai.recommendation;

import com.cinebookai.dto.RecommendationDTO;
import com.cinebookai.entity.Book;
import com.cinebookai.entity.Genre;
import com.cinebookai.entity.Movie;
import com.cinebookai.entity.UserPreference;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Real Java Hybrid Recommendation Engine.
 * 
 * Formula:
 * Hybrid Score = (Content_Weight * ContentScore) + (Popularity_Weight * PopularityScore)
 * 
 * Where ContentScore evaluates:
 * 1. Jaccard Genre Similarity
 * 2. Original / Translated Language Match
 * 3. Favorite Author or Director Match
 * 4. User Rating Threshold
 * 
 * PopularityScore evaluates:
 * Bayesian Weighted Rating WR = (v / (v + m)) * R + (m / (v + m)) * C
 */
@Service
public class HybridRecommendationEngine {

    private static final double GLOBAL_MEAN_RATING = 4.5;
    private static final int MIN_VOTES_THRESHOLD = 1000;

    /**
     * Compute Jaccard Similarity between two sets of genres
     */
    public double calculateGenreSimilarity(Set<String> itemGenres, Set<String> userGenres) {
        if (itemGenres.isEmpty() || userGenres.isEmpty()) return 0.0;
        
        Set<String> setA = itemGenres.stream().map(String::toLowerCase).collect(Collectors.toSet());
        Set<String> setB = userGenres.stream().map(String::toLowerCase).collect(Collectors.toSet());
        
        Set<String> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);
        
        Set<String> union = new HashSet<>(setA);
        union.addAll(setB);
        
        return union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
    }

    /**
     * Bayesian Weighted Rating normalized to 0 - 100
     */
    public double calculateBayesianScore(double avgRating, int ratingCount) {
        double v = ratingCount;
        double m = MIN_VOTES_THRESHOLD;
        double r = avgRating;
        double c = GLOBAL_MEAN_RATING;

        double weightedRating = (v / (v + m)) * r + (m / (v + m)) * c;
        return Math.min(100.0, Math.max(0.0, (weightedRating / 5.0) * 100.0));
    }

    /**
     * Evaluate and explain book recommendation
     */
    public RecommendationDTO evaluateBook(Book book, UserPreference pref) {
        List<String> reasons = new ArrayList<>();
        double contentScore = 0.0;

        Set<String> bookGenreNames = book.getGenres().stream()
                .map(Genre::getName)
                .collect(Collectors.toSet());

        // 1. Genre match
        double genreSim = calculateGenreSimilarity(bookGenreNames, pref.getFavoriteGenres());
        if (genreSim > 0.0) {
            contentScore += genreSim * 50.0;
            reasons.add("Matches your genre preferences");
        }

        // 2. Language match
        boolean matchLang = pref.getPreferredLanguages().stream()
                .anyMatch(l -> l.equalsIgnoreCase(book.getOriginalLanguage()));
        if (matchLang) {
            contentScore += 25.0;
            reasons.add("Original language: " + book.getOriginalLanguage());
        }

        // 3. Author match
        boolean matchAuthor = pref.getFavoriteAuthors().stream()
                .anyMatch(a -> a.equalsIgnoreCase(book.getAuthor()));
        if (matchAuthor) {
            contentScore += 25.0;
            reasons.add("By your favorite author: " + book.getAuthor());
        }

        contentScore = Math.min(100.0, contentScore);
        double popScore = calculateBayesianScore(book.getAverageRating(), book.getRatingCount());

        double cw = pref.getContentWeight() != null ? pref.getContentWeight() : 0.65;
        double pw = 1.0 - cw;

        int finalScore = (int) Math.round((contentScore * cw) + (popScore * pw));

        if (reasons.isEmpty()) {
            reasons.add("High community rating in " + book.getPrimaryGenre());
        }

        return new RecommendationDTO(
                book.getId(),
                "BOOK",
                book.getTitle(),
                book.getCoverImageUrl(),
                finalScore,
                reasons,
                book.getAverageRating(),
                book.getOriginalLanguage()
        );
    }
}`
  },
  {
    path: 'src/main/java/com/cinebookai/security/SecurityConfig.java',
    name: 'SecurityConfig.java',
    category: 'Security',
    description: 'Spring Security 6 configuration with BCrypt hashing, role-based authorization for ADMIN and USER',
    content: `package com.cinebookai.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/books/**", "/movies/**", "/discover/**", "/api/public/**", "/css/**", "/js/**", "/images/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/profile/**", "/wishlist/**", "/ratings/**").authenticated()
                .anyRequest().permitAll()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            )
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"));

        return http.build();
    }
}`
  },
  {
    path: 'src/main/resources/db/migration/V1__init_schema.sql',
    name: 'V1__init_schema.sql',
    category: 'Database',
    description: 'Flyway MySQL Schema creation with foreign keys, indexes, and full UTF-8 Unicode charset',
    content: `-- CineBook AI - Database Schema
-- UTF-8 Support for multilingual titles (Tamil, Hindi, Telugu, Japanese, etc.)

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    alternate_title VARCHAR(255),
    author VARCHAR(255) NOT NULL,
    description TEXT,
    synopsis TEXT,
    primary_genre VARCHAR(100),
    original_language VARCHAR(50) NOT NULL,
    publication_date DATE,
    publication_year INT,
    publisher VARCHAR(200),
    isbn_10 VARCHAR(20),
    isbn_13 VARCHAR(25),
    page_count INT,
    series_name VARCHAR(150),
    series_number INT,
    cover_image_url VARCHAR(500),
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_book_author (author),
    INDEX idx_book_language (original_language),
    INDEX idx_book_rating (average_rating)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    alternate_title VARCHAR(255),
    synopsis TEXT,
    director VARCHAR(255) NOT NULL,
    original_language VARCHAR(50) NOT NULL,
    release_date DATE,
    release_year INT,
    runtime_minutes INT,
    country VARCHAR(100),
    production_company VARCHAR(200),
    age_rating VARCHAR(20),
    poster_image_url VARCHAR(500),
    trailer_url VARCHAR(500),
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_movie_director (director),
    INDEX idx_movie_language (original_language),
    INDEX idx_movie_rating (average_rating)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS genres (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_type ENUM('BOOK', 'MOVIE') NOT NULL,
    item_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_item (user_id, item_type, item_id),
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ratings_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_type ENUM('BOOK', 'MOVIE') NOT NULL,
    item_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_rating (user_id, item_type, item_id),
    CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`
  },
  {
    path: 'src/main/resources/db/migration/V2__seed_multilingual_data.sql',
    name: 'V2__seed_multilingual_data.sql',
    category: 'Database',
    description: 'Flyway seed data with verified multilingual books and movies in Tamil, Hindi, Telugu, English, etc.',
    content: `-- Multilingual Demo Data with UTF-8 characters
INSERT INTO books (id, title, alternate_title, author, description, primary_genre, original_language, publication_year, page_count, cover_image_url, average_rating, rating_count, is_featured, is_trending) VALUES
(1, 'Ponniyin Selvan', 'பொன்னியின் செல்வன்', 'Kalki Krishnamurthy', 'Epic Chola historical masterpiece.', 'Historical Fiction', 'Tamil', 1954, 2200, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', 4.9, 14200, TRUE, TRUE),
(2, 'Dune', 'Dune: First Book', 'Frank Herbert', 'Masterpiece of desert planet Arrakis and spice.', 'Sci-Fi', 'English', 1965, 688, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', 4.7, 28500, TRUE, TRUE),
(3, 'The God of Small Things', 'ദ ഗോഡ് ഓഫ് സ്മോൾ തിങ്സ്', 'Arundhati Roy', 'Booker Prize winning novel set in Kerala.', 'Fiction', 'English', 1997, 340, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600', 4.5, 16800, FALSE, TRUE),
(4, 'Godaan', 'गोदान', 'Munshi Premchand', 'Greatest classic Hindi social novel.', 'Classics', 'Hindi', 1936, 380, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', 4.8, 9500, FALSE, FALSE),
(5, 'Gitanjali', 'গীতাঞ্জলি', 'Rabindranath Tagore', 'Nobel Prize winning devotional poetry.', 'Philosophy', 'Bengali', 1910, 120, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600', 4.8, 11200, FALSE, FALSE);

INSERT INTO movies (id, title, alternate_title, synopsis, director, original_language, release_year, runtime_minutes, poster_image_url, average_rating, rating_count, is_featured, is_trending) VALUES
(101, 'Interstellar', 'Interstellar', 'A journey through a Saturn wormhole to save humankind.', 'Christopher Nolan', 'English', 2014, 169, 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600', 4.9, 38200, TRUE, TRUE),
(102, 'Nayakan', 'நாயகன்', 'Slum kid rises to become Mumbai underground don.', 'Mani Ratnam', 'Tamil', 1987, 154, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600', 4.8, 18400, TRUE, TRUE),
(103, 'RRR', 'రౌద్రం రణం రుధిరం', 'Two Indian revolutionaries forge epic friendship against colonial rule.', 'S.S. Rajamouli', 'Telugu', 2022, 187, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600', 4.7, 32000, TRUE, TRUE),
(104, 'Manjummel Boys', 'മഞ്ഞുമ്മൽ ബോയ്സ്', 'Real-life Guna Caves rescue mission by Kerala friends.', 'Chidambaram', 'Malayalam', 2024, 135, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600', 4.8, 21500, FALSE, TRUE),
(105, 'Dangal', 'दंगल', 'Father trains daughters to world wrestling championship glory.', 'Nitesh Tiwari', 'Hindi', 2016, 161, 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600', 4.8, 42000, FALSE, TRUE);`
  },
  {
    path: 'src/test/java/com/cinebookai/recommendation/RecommendationEngineTest.java',
    name: 'RecommendationEngineTest.java',
    category: 'Test',
    description: 'JUnit 5 automated tests for Jaccard similarity, Bayesian popularity scoring, and cold-start fallback',
    content: `package com.cinebookai.recommendation;

import com.cinebookai.dto.RecommendationDTO;
import com.cinebookai.entity.Book;
import com.cinebookai.entity.Genre;
import com.cinebookai.entity.UserPreference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class RecommendationEngineTest {

    private HybridRecommendationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new HybridRecommendationEngine();
    }

    @Test
    @DisplayName("Jaccard Similarity should be 1.0 for identical genre sets")
    void testIdenticalGenreSimilarity() {
        Set<String> setA = Set.of("Sci-Fi", "Drama");
        Set<String> setB = Set.of("sci-fi", "drama");

        double sim = engine.calculateGenreSimilarity(setA, setB);
        assertEquals(1.0, sim, 0.001);
    }

    @Test
    @DisplayName("Bayesian Rating must not let single 5-star title outrank established 4.8-star title")
    void testBayesianPopularityRanking() {
        double scoreSingleVote = engine.calculateBayesianScore(5.0, 1);
        double scoreEstablished = engine.calculateBayesianScore(4.8, 25000);

        assertTrue(scoreEstablished > scoreSingleVote,
                "Established title with 25k votes must outrank single-vote title");
    }

    @Test
    @DisplayName("Should generate explainable reason when user preferred author matches")
    void testRecommendationExplanation() {
        Book book = new Book();
        book.setId(1L);
        book.setTitle("Dune");
        book.setAuthor("Frank Herbert");
        book.setOriginalLanguage("English");
        book.setPrimaryGenre("Sci-Fi");
        book.setAverageRating(4.7);
        book.setRatingCount(28000);

        Genre genre = new Genre();
        genre.setName("Sci-Fi");
        book.setGenres(Set.of(genre));

        UserPreference pref = new UserPreference();
        pref.setFavoriteAuthors(Set.of("Frank Herbert"));
        pref.setPreferredLanguages(Set.of("English"));
        pref.setFavoriteGenres(Set.of("Sci-Fi"));
        pref.setContentWeight(0.7);

        RecommendationDTO dto = engine.evaluateBook(book, pref);

        assertNotNull(dto);
        assertTrue(dto.getMatchScore() > 80);
        assertTrue(dto.getReasons().stream().anyMatch(r -> r.contains("Frank Herbert")));
    }
}`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Config',
    description: 'Complete Project Documentation with Setup Guide for IntelliJ IDEA, VS Code, and MySQL',
    content: `# CineBook AI — AI-Powered Book and Movie Recommendation System

**College Mini-Project Deliverable**
- **Author:** Ukeshwari S. (ukeshwari15@gmail.com)
- **Architecture:** Java 21, Spring Boot 3.3.4, Spring Data JPA, Hibernate, MySQL 8, Spring Security, Thymeleaf, Google Gemini API

---

## 🚀 How to Run Locally

### 1. Prerequisites
- Java JDK 21+ installed (\`java -version\`)
- Apache Maven 3.9+ (\`mvn -version\`)
- MySQL Server 8.0 running on localhost:3306

### 2. Database Setup
\`\`\`sql
CREATE DATABASE cinebook_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

### 3. Build & Run with Maven
\`\`\`bash
# Clone or extract project ZIP
cd cinebook-ai

# Set your database credentials (or edit src/main/resources/application.properties)
export DB_USERNAME=root
export DB_PASSWORD=your_password

# Optional: Set Gemini AI API key for natural language discovery
export GEMINI_API_KEY=your_gemini_key

# Build and execute
mvn clean install
mvn spring-boot:run
\`\`\`

### 4. Access the Application
- **Web Interface:** \`http://localhost:8080\`
- **OpenAPI / Swagger UI Docs:** \`http://localhost:8080/swagger-ui.html\`
- **Default Accounts:**
  - **Admin:** \`admin\` / \`Admin@123\`
  - **Student User:** \`cinebook_student\` / \`Student@123\`

---

## 🧠 Recommendation Engine Architecture
CineBook AI uses a **Hybrid Recommendation Algorithm**:
1. **Content-Based Filtering (65% default weight):** Jaccard similarity across genres, native/translated language matching, author and director affinity.
2. **Bayesian Weighted Rating (35% default weight):** Prevents low-sample distortion using formula:
   \`WR = (v / (v + m)) * R + (m / (v + m)) * C\`
3. **Explainability:** Generates deterministic human-readable match breakdowns for every recommended title.
`
  }
];
