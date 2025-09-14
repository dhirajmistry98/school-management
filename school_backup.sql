-- MySQL dump 10.13  Distrib 9.4.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: school_management
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schools` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `contact` varchar(15) NOT NULL,
  `image` text,
  `email_id` varchar(255) NOT NULL,
  `board` varchar(50) DEFAULT 'CBSE',
  `type` enum('Co-ed','Boys','Girls') DEFAULT 'Co-ed',
  `hostel_facility` enum('Yes','No') DEFAULT 'No',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES (1,'La Martiniere College','Hazratganj','Lucknow','Uttar Pradesh','9876543210',NULL,'info@lamartiniere.edu.in','ICSE','Boys','Yes','2025-09-02 19:32:48'),(2,'Jagran Public School','Gomti Nagar','Lucknow','Uttar Pradesh','9876543211',NULL,'info@jagranschool.edu.in','CBSE','Co-ed','No','2025-09-02 19:32:48'),(3,'Seth Anandram Jaipuria','Gomti Nagar','Lucknow','Uttar Pradesh','9876543212',NULL,'info@jaipuria.edu.in','CBSE','Co-ed','Yes','2025-09-02 19:32:48'),(4,'Dhiraj Mistry','Mulund','Mumbai','Maharashtra','9819065290',NULL,'dhirajmistry1368@gmail.com','ICSE','Co-ed','Yes','2025-09-02 20:02:38'),(5,'Dhiraj Mistry','JN Road, Pandit Jawaharlal Nehru Road','Mumbai','Maharashtra','9819065290','/schoolImages/image-1756843923850-364513879.JPG','dhirajmistry6930@gmail.com','State Board','Co-ed','No','2025-09-02 20:12:05'),(6,'hello','JN Road, Pandit Jawaharlal Nehru Road','Mumbai','Maharashtra','0981965290','/schoolImages/image-1756845773495-206497430.jpg','dhirajmistry@gmail.com','IB','Boys','Yes','2025-09-02 20:43:04'),(7,'Dhiraj Mistry','JN Road, Pandit Jawaharlal Nehru Road','Mumbai','Maharashtra','0981906290','/schoolImages/image-1756845875063-529357895.png','dhirajmistry@gmail.com','ICSE','Girls','No','2025-09-02 20:44:37'),(8,'hindu','Uttar Pradesh','varanasi','Uttar Pradesh','9876543201',NULL,'dhiraj@gmail.com','ICSE','Boys','Yes','2025-09-02 20:56:49'),(9,'raj','no','jksnw','wdlkwdn','0981906529',NULL,'dhiraj@gmail.com','ICSE','Boys','Yes','2025-09-02 20:59:35'),(10,'ram','JN Road, Pandit Jawaharlal Nehru Road','Mumbai','Maharashtra','9876543210','/schoolImages/image-1756847141622-283519432.jpeg','dhiraj@gmail.com','ICSE','Boys','Yes','2025-09-02 21:06:01'),(11,'Dhiraj Mistry','Mulund','Mumbai','Maharashtra','0981906529',NULL,'dhirajmistry@gmail.com','ICSE','Co-ed','No','2025-09-02 21:16:01'),(12,'Dhiraj Mistry','Mulund','Mumbai','Maharashtra','0981905290','/schoolImages/image-1756848153002-207038229.jpeg','dhiraj@gmail.com','ICSE','Boys','Yes','2025-09-02 21:22:42'),(13,'hello','Mulund','Mumbai','Maharashtra','0981965290','https://res.cloudinary.com/drbfmvjuu/image/upload/v1756878378/school-images/ecjxuwm9gmqmavfrnz5g.jpg','dhira@gmail.com','CBSE','Boys','No','2025-09-03 05:46:23');
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-03 12:16:50
