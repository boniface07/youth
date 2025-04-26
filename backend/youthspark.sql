CREATE DATABASE  IF NOT EXISTS `youth_spark` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `youth_spark`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: youth_spark
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `about`
--

DROP TABLE IF EXISTS `about`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vision` text NOT NULL,
  `mission` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about`
--

LOCK TABLES `about` WRITE;
/*!40000 ALTER TABLE `about` DISABLE KEYS */;
INSERT INTO `about` VALUES (1,'Building a future where Tanzanian youth thrive through education, digital skills, and entrepreneurship, fostering a prosperous and equitable society.','Vesting Tanzanian youth with the knowledge, skills, and opportunities they need to succeed in a rapidly evolving world through education, digital literacy, economic empowerment, entrepreneurship training, and employability skills.','2025-04-21 12:12:22','2025-04-22 19:04:25');
/*!40000 ALTER TABLE `about` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history_points`
--

DROP TABLE IF EXISTS `history_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `history_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `about_id` int NOT NULL,
  `point` text NOT NULL,
  `order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `about_id` (`about_id`),
  CONSTRAINT `history_points_ibfk_1` FOREIGN KEY (`about_id`) REFERENCES `about` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history_points`
--

LOCK TABLES `history_points` WRITE;
/*!40000 ALTER TABLE `history_points` DISABLE KEYS */;
INSERT INTO `history_points` VALUES (2,1,'Youth Spark Foundation was established to address the numerous challenges that Tanzanian youth face in their pursuit of education, employment, and personal development.',1,'2025-04-22 19:04:25','2025-04-22 19:04:25'),(3,1,'Our founders recognized that access to formal education is limited, especially in underserved communities, leading to a lack of skills and opportunities for economic advancement.That rapid evolving digital landscapr futher exacerbates these disparties, as many youth lack the necessary digital skills to compete in the today\'s job market employability skills to Tanzanian youth',2,'2025-04-22 19:04:25','2025-04-22 19:04:25');
/*!40000 ALTER TABLE `history_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home`
--

DROP TABLE IF EXISTS `home`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image_url` varchar(2083) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home`
--

LOCK TABLES `home` WRITE;
/*!40000 ALTER TABLE `home` DISABLE KEYS */;
INSERT INTO `home` VALUES (1,'Youth Spark Foundation ','Building a future where Tanzanian youth thrive through education, digital skills, and entrepreneurship, fostering a prosperous and equitable society','http://localhost:5000/images/1745220157872-996371952.jpg','2025-04-20 20:01:54');
/*!40000 ALTER TABLE `home` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mission_points`
--

DROP TABLE IF EXISTS `mission_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mission_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `about_id` int NOT NULL,
  `point` text NOT NULL,
  `order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `about_id` (`about_id`),
  CONSTRAINT `mission_points_ibfk_1` FOREIGN KEY (`about_id`) REFERENCES `about` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mission_points`
--

LOCK TABLES `mission_points` WRITE;
/*!40000 ALTER TABLE `mission_points` DISABLE KEYS */;
INSERT INTO `mission_points` VALUES (3,1,'Promote access to formal education for Tanzanian youth, particularly in underserved communities.',1,'2025-04-22 19:04:25','2025-04-22 19:04:25'),(4,1,'Empower youth to navigate the digital economy and leverage technology for economic growth.',2,'2025-04-22 19:04:25','2025-04-22 19:04:25'),(5,1,'Foster enterpreneurial innovation, creativity,and business acumen among Tanzanian Youth.',3,'2025-04-22 19:04:25','2025-04-22 19:04:25'),(6,1,'Equip youth with employability skills to enhance their job prospects and employment oppotunities.',4,'2025-04-22 19:04:25','2025-04-22 19:04:25'),(7,1,'Advocate for the policies that improve access to  quality education for Tanzania youth',5,'2025-04-22 19:04:25','2025-04-22 19:04:25'),(8,1,'Promote job placement services for yout to escape the cycle of poverty and achieve economic stability',6,'2025-04-22 19:04:25','2025-04-22 19:04:25'),(9,1,'Advocate the prevention of substance abuse amoung Tanzanian youth',7,'2025-04-22 19:04:25','2025-04-22 19:04:25');
/*!40000 ALTER TABLE `mission_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES (65,'Education Access','Promotindg access to formal education for Tanzanian youth, particularly in underserved communities.','School',1,'2025-04-22 22:29:36','2025-04-22 22:29:36'),(66,'Digital Skills','Empowering youth to navigate the digital economy and leverage technology for economic growth.','Code',2,'2025-04-22 22:29:36','2025-04-22 22:29:36'),(67,'Entrepreneurship','Fostering entrepreneurial innovation, creativity, and business acumen among Tanzanian youth.','BusinessCenter',3,'2025-04-22 22:29:36','2025-04-22 22:29:36'),(68,'Employability','Equipping youth with employability skills to enhance their job prospects and employment opportunities.','Work',4,'2025-04-22 22:29:36','2025-04-22 22:29:36'),(69,'Mental Health','Advocating for improved access to mental health services and support for Tanzanian youth.','Favorite',5,'2025-04-22 22:29:36','2025-04-22 22:29:36'),(70,'Tanzania Huru','<p>Tanzania imeanza kubadilika na kuwa nchi.</p>','MonetizationOn',6,'2025-04-22 22:29:36','2025-04-22 22:29:36');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stats`
--

DROP TABLE IF EXISTS `stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stats`
--

LOCK TABLES `stats` WRITE;
/*!40000 ALTER TABLE `stats` DISABLE KEYS */;
INSERT INTO `stats` VALUES (13,'1000+','Youth Empowered','EmojiEvents',1,'2025-04-23 08:30:02','2025-04-23 08:30:02'),(14,'25+','Communities Reached','Groups',2,'2025-04-23 08:30:02','2025-04-23 08:30:02'),(15,'10+','Programs','School',3,'2025-04-23 08:30:02','2025-04-23 08:30:02'),(16,'100+','Partners','Handshake',4,'2025-04-23 08:30:02','2025-04-23 08:30:02'),(17,'500+','Jobs Created','Work',5,'2025-04-23 08:30:02','2025-04-23 08:30:02'),(18,'50+','Innovative Projects','Lightbulb',6,'2025-04-23 08:30:02','2025-04-23 08:30:02');
/*!40000 ALTER TABLE `stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quote` text NOT NULL,
  `name` varchar(100) NOT NULL,
  `program` varchar(100) NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (8,'The digital skills program changed my life. I now work as a freelance web developer and can support my family.','Maria Joseph','Digital Skills Graduate',1,'2025-04-23 08:30:02','2025-04-23 08:30:02'),(9,'Thanks to the entrepreneurship training, I started my own business that now employs five other young people from my community.','John Milovanho','Entrepreneurship Program',2,'2025-04-23 08:30:02','2025-04-23 08:30:02'),(10,'I never thought I would be able to continue my education. Youth Spark Foundation made it possible for me to attend university.','Sarah Kimaro','Education Access Beneficiary',3,'2025-04-23 08:30:02','2025-04-23 08:30:02');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@example.com','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918','admin','2025-04-19 16:20:00'),(2,'user','user@example.com','04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb','user','2025-04-19 16:20:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-24 10:52:52
