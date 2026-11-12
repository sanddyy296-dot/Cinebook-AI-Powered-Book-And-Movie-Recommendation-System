-- CineBook AI - Database Schema (MySQL 8)
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
);
