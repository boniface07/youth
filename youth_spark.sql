-- Create the database
CREATE DATABASE youth_spark;

-- Use the database
USE youth_spark;

-- Create the 'home' table
CREATE TABLE home (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(2083),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop the 'home' table if it exists
DROP TABLE IF EXISTS home;

-- Recreate the 'home' table
CREATE TABLE home (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(2083),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert new data into the 'home' table
INSERT INTO home (title, description, image_url) 
VALUES 
(
    'Youth Spark Foundation', 
    "Building a future where Tanzanian youth thrive through education, digital skills, and entrepreneurship, fostering a prosperous and equitable society.", 
    'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
);

CREATE TABLE about (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vision TEXT NOT NULL,
    mission TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE mission_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    about_id INT NOT NULL,
    point TEXT NOT NULL,
    `order` INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (about_id) REFERENCES about(id) ON DELETE CASCADE
);
CREATE TABLE history_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    about_id INT NOT NULL,
    point TEXT NOT NULL,
    `order` INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (about_id) REFERENCES about(id) ON DELETE CASCADE
);

-- Insert data into the 'about' table
INSERT INTO about (vision, mission) 
VALUES 
(
    'Building a future where Tanzanian youth thrive through education, digital skills, and entrepreneurship, fostering a prosperous and equitable society.',
    'Vesting Tanzanian youth with the knowledge, skills, and opportunities they need to succeed in a rapidly evolving world through education, digital literacy, economic empowerment, entrepreneurship training, and employability skills.'
);

-- Get the last inserted 'about' ID
SET @about_id = LAST_INSERT_ID();

-- Insert data into the 'mission_points' table
INSERT INTO mission_points (about_id, point, `order`) 
VALUES 
(@about_id, 'Promote access to formal education for Tanzanian youth, particularly in underserved communities.', 1),
(@about_id, 'Empower youth to navigate the digital economy and leverage technology for economic growth.', 2);

-- Insert data into the 'history_points' table
INSERT INTO history_points (about_id, point, `order`) 
VALUES 
(@about_id, 'Youth Spark Foundation was established to address the numerous challenges that Tanzanian youth face in their pursuit of education, employment, and personal development.', 1);


CREATE TABLE programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  `order` INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO programs (title, description, icon, `order`) VALUES
  ('Education Access', 'Promoting access to formal education for Tanzanian youth, particularly in underserved communities.', 'School', 1),
  ('Digital Skills', 'Empowering youth to navigate the digital economy and leverage technology for economic growth.', 'Code', 2),
  ('Entrepreneurship', 'Fostering entrepreneurial innovation, creativity, and business acumen among Tanzanian youth.', 'BusinessCenter', 3),
  ('Employability', 'Equipping youth with employability skills to enhance their job prospects and employment opportunities.', 'Work', 4),
  ('Mental Health', 'Advocating for improved access to mental health services and support for Tanzanian youth.', 'Favorite', 5);

CREATE TABLE stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(50) NOT NULL, -- e.g., "1000+"
  label VARCHAR(100) NOT NULL, -- e.g., "Youth Empowered"
  icon VARCHAR(100) NOT NULL, -- e.g., "EmojiEvents"
  `order` INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote TEXT NOT NULL, -- Plain text
  name VARCHAR(100) NOT NULL, -- e.g., "Maria Joseph"
  program VARCHAR(100) NOT NULL, -- e.g., "Digital Skills Graduate"
  avatar VARCHAR(255) NOT NULL, -- e.g., "/avatars/maria.jpg"
  `order` INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO stats (value, label, icon, `order`) VALUES
('1000+', 'Youth Empowered', 'EmojiEvents', 1),
('25+', 'Communities Reached', 'Groups', 2),
('10+', 'Programs', 'School', 3),
('100+', 'Partners', 'Handshake', 4);

INSERT INTO testimonials (quote, name, program, avatar, `order`) VALUES
('The digital skills program changed my life. I now work as a freelance web developer and can support my family.', 'Maria Joseph', 'Digital Skills Graduate', '/avatars/maria.jpg', 1),
('Thanks to the entrepreneurship training, I started my own business that now employs five other young people from my community.', 'John Milovanho', 'Entrepreneurship Program', '/avatars/john.jpg', 2),
('I never thought I would be able to continue my education. Youth Spark Foundation made it possible for me to attend university.', 'Sarah Kimaro', 'Education Access Beneficiary', '/avatars/sarah.jpg', 3);

-- Table for general contact information (header, email, phone, map URL)
CREATE TABLE contact (
  id INT PRIMARY KEY DEFAULT 1,
  title VARCHAR(100) NOT NULL, -- Header title
  subtitle VARCHAR(255) NOT NULL, -- Header subtitle
  email VARCHAR(100) NOT NULL, -- Email address
  phone VARCHAR(50) NOT NULL, -- Phone number
  map_embed_url TEXT NOT NULL, -- Google Maps embed URL
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for address lines (multi-line address)
CREATE TABLE contact_address (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT NOT NULL,
  line VARCHAR(255) NOT NULL,
  `order` INT NOT NULL, -- To maintain order of address lines
  FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
);

-- Table for CTA section (title, description)
CREATE TABLE contact_cta (
  id INT PRIMARY KEY DEFAULT 1,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  contact_id INT NOT NULL,
  FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
);

-- Table for CTA buttons
CREATE TABLE cta_buttons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT NOT NULL,
  label VARCHAR(50) NOT NULL,
  href VARCHAR(255) NOT NULL,
  variant ENUM('contained', 'outlined') NOT NULL,
  `order` INT NOT NULL, -- To maintain button order
  FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
);

-- Table for footer branding
CREATE TABLE footer_branding (
  id INT PRIMARY KEY DEFAULT 1,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  logo VARCHAR(255), -- Optional logo filename (e.g., for file upload)
  contact_id INT NOT NULL,
  FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
);

-- Table for navigation links
CREATE TABLE nav_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT NOT NULL,
  label VARCHAR(50) NOT NULL,
  href VARCHAR(255) NOT NULL,
  `order` INT NOT NULL, -- To maintain link order
  FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
);

-- Table for social media links
CREATE TABLE social_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT NOT NULL,
  platform ENUM('Twitter', 'LinkedIn', 'Instagram') NOT NULL, -- Restrict to supported platforms
  href VARCHAR(255) NOT NULL,
  `order` INT NOT NULL, -- To maintain link order
  FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
);

-- Initialize default contact record
INSERT INTO contact (id, title, subtitle, email, phone, map_embed_url)
VALUES (
  1,
  'Contact Us',
  'Get in touch with Youth Spark Foundation',
  'info@youthsparkfoundation.org',
  '+255 123 456 789',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22409.55061808312!2d39.29295517782635!3d-6.832146404689002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b00383a539f%3A0xfc96d88a737b5d6a!2sSERENGETI%20STREET%20KIGAMBONI!5e0!3m2!1sen!2stz!4v1744889391826!5m2!1sen!2stz'
);