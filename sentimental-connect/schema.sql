-- Create MySQL schema for LinkedIn
-- Setting character set and collation for proper Unicode support
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

-- Create users table
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB;

-- Create schools table
CREATE TABLE schools (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('Primary', 'Secondary', 'Higher Education') NOT NULL,
    location VARCHAR(100) NOT NULL,
    founding_year SMALLINT UNSIGNED NOT NULL,
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- Create companies table
CREATE TABLE companies (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    industry ENUM('Technology', 'Education', 'Business') NOT NULL,
    location VARCHAR(100) NOT NULL,
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- Create connections between users (network connections)
CREATE TABLE user_connections (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id_1 INT UNSIGNED NOT NULL,
    user_id_2 INT UNSIGNED NOT NULL,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'connected', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_connection (user_id_1, user_id_2),
    CHECK (user_id_1 <> user_id_2) -- Prevent self-connections
) ENGINE=InnoDB;

-- Create user-school connections (education)
CREATE TABLE user_education (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    school_id INT UNSIGNED NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_school_id (school_id)
) ENGINE=InnoDB;

-- Create user-company connections (employment)
CREATE TABLE user_employment (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    company_id INT UNSIGNED NOT NULL,
    title VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_company_id (company_id)
) ENGINE=InnoDB;

-- Insert sample data

-- Insert users
INSERT INTO users (first_name, last_name, username, password)
VALUES
    ('Claudine', 'Gay', 'claudine', 'password'),
    ('Reid', 'Hoffman', 'reid', 'password');

-- Insert schools
INSERT INTO schools (name, type, location, founding_year)
VALUES
    ('Harvard University', 'Higher Education', 'Cambridge, Massachusetts', 1636);

-- Insert companies
INSERT INTO companies (name, industry, location)
VALUES
    ('LinkedIn', 'Technology', 'Sunnyvale, California');

-- Get IDs for the inserted data
SET @claudine_id = (SELECT id FROM users WHERE username = 'claudine');
SET @reid_id = (SELECT id FROM users WHERE username = 'reid');
SET @harvard_id = (SELECT id FROM schools WHERE name = 'Harvard University');
SET @linkedin_id = (SELECT id FROM companies WHERE name = 'LinkedIn');

-- Insert education data for Claudine Gay
INSERT INTO user_education (user_id, school_id, degree, field_of_study, start_date, end_date)
VALUES
    (@claudine_id, @harvard_id, 'PhD', NULL, '1993-01-01', '1998-12-31');

-- Insert employment data for Reid Hoffman
INSERT INTO user_employment (user_id, company_id, title, start_date, end_date, is_current)
VALUES
    (@reid_id, @linkedin_id, 'CEO and Chairman', '2003-01-01', '2007-02-01', FALSE);
