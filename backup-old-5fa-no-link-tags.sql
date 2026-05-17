-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: fb_manager
-- ------------------------------------------------------
-- Server version	5.7.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_cards`
--

DROP TABLE IF EXISTS `account_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_cards` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `account_id` bigint(20) NOT NULL,
  `card_id` bigint(20) NOT NULL,
  `payment_type` enum('main','backup') DEFAULT 'backup',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_account_card` (`account_id`,`card_id`),
  KEY `card_id` (`card_id`),
  CONSTRAINT `account_cards_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `account_cards_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_cards`
--

LOCK TABLES `account_cards` WRITE;
/*!40000 ALTER TABLE `account_cards` DISABLE KEYS */;
INSERT INTO `account_cards` VALUES (3,1,2,'backup','active','2026-05-04 21:45:30'),(6,10,5,'main','active','2026-05-08 22:00:28'),(10,2,5,'main','active','2026-05-09 00:42:58'),(11,6,2,'backup','active','2026-05-11 06:00:19'),(12,6,1,'backup','active','2026-05-11 07:27:18'),(21,16,4,'backup','active','2026-05-12 08:20:15'),(22,15,5,'main','active','2026-05-12 08:27:56'),(23,17,7,'main','active','2026-05-12 08:31:17'),(24,15,6,'backup','active','2026-05-12 23:43:51'),(26,16,7,'backup','active','2026-05-13 00:34:02'),(27,19,5,'backup','active','2026-05-15 05:50:54'),(28,19,6,'backup','active','2026-05-15 05:51:03'),(29,20,7,'backup','active','2026-05-15 05:51:18');
/*!40000 ALTER TABLE `account_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_pages`
--

DROP TABLE IF EXISTS `account_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_pages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `account_id` bigint(20) NOT NULL,
  `page_id` varchar(100) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_account_page` (`account_id`,`page_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_pages`
--

LOCK TABLES `account_pages` WRITE;
/*!40000 ALTER TABLE `account_pages` DISABLE KEYS */;
INSERT INTO `account_pages` VALUES (3,1,'1067377279794703','active','2026-05-05 02:31:56'),(4,6,'808993648955401','active','2026-05-11 06:00:09'),(23,16,'1126410903892601','active','2026-05-12 08:20:04'),(24,15,'808993648955401','active','2026-05-12 08:27:22'),(25,17,'1141719219017803','active','2026-05-12 08:31:07'),(26,19,'808993648955401','active','2026-05-15 05:16:36');
/*!40000 ALTER TABLE `account_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `account_pixels`
--

DROP TABLE IF EXISTS `account_pixels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account_pixels` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `account_id` bigint(20) NOT NULL,
  `px_id` varchar(100) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_account_pixel` (`account_id`,`px_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_pixels`
--

LOCK TABLES `account_pixels` WRITE;
/*!40000 ALTER TABLE `account_pixels` DISABLE KEYS */;
INSERT INTO `account_pixels` VALUES (1,3,'1751156656293833','active','2026-05-04 21:39:15'),(3,1,'1751156656293833','active','2026-05-04 21:39:24'),(12,10,'1751156656293833','active','2026-05-09 02:49:32'),(13,2,'1262467879435092','active','2026-05-09 04:17:47'),(14,6,'1262467879435092','active','2026-05-11 06:00:15'),(22,16,'1262467879435092','active','2026-05-12 08:19:48'),(23,15,'1262467879435092','active','2026-05-12 08:27:04'),(24,17,'1262467879435092','active','2026-05-12 08:29:16'),(25,19,'1262467879435092','active','2026-05-15 05:16:49'),(26,20,'1262467879435092','active','2026-05-15 05:29:54');
/*!40000 ALTER TABLE `account_pixels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `secret_code` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `email_password` text,
  `temp_mail` varchar(150) DEFAULT NULL,
  `bm` varchar(100) NOT NULL,
  `status` enum('active','bm_die','main_die','BmAndMain_die','cancel') DEFAULT 'active',
  `remark` text,
  `password_hash` varchar(64) NOT NULL,
  `email_password_hash` varchar(64) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_full_account` (`username`,`password_hash`,`secret_code`,`email`,`email_password_hash`,`bm`),
  KEY `idx_accounts_status` (`status`),
  KEY `idx_accounts_username` (`username`),
  KEY `idx_accounts_bm` (`bm`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'61577094277343','6d0fd620f0ff4adb266fcab703dad6d0','7252e9e3f9f1be226647ec2ea7c1a27e728ae4ae6082b5b56cd0f0db9565a9d02380a005322a5d26e93867aa7693dad7','stebataindriskell22021983ubxve@hotmail.com','7efe647958bd9182b6bc309b5784febb','stebataindriskell22021983ubxve0604@fviainboxes.com','966618305914195','BmAndMain_die',NULL,'c588239f85048ec9cf88623c89f17fd9444c491ca1b8579c1fc2e7607c6ba2b6','64574caf7d2401707a5f5efe01a35f5e26001ce6dda47ca609b59c1ddaa6fa84','2026-05-04 21:28:45','2026-05-12 07:19:13'),(2,'61577201261844','23180e120fce61862d31f92203aaa4e6c53c8a2ff80cf3460dffbcd22b624f93','b561846c3033d5acd40c7bc3abd4138c199f2eed75343fffac27d57c41ec7361ec242306df0e649a7a048ed9a1393098','plesairojinokfk88@hotmail.com','1fc53588233b5181095a1b44dcea496086a29441ee2bd779a37ce144fb1bcf26','plesairojinokfk880429@fviainboxes.com','841479305013669','bm_die','ยืนยันบัตรผ่านแล้ว','1e53b1ac0a0bcf2029e6081a313a1c202515e128ec2f0afe5bd0299e76e68aad','ec5eb2307c8a4f278f4b6a76255c00a6207f0d63164d02dc4536d9e429b2c9ee','2026-05-04 21:29:27','2026-05-11 02:23:41'),(3,'61577206059946','23180e120fce61862d31f92203aaa4e61eea8ea0d02fce2cb0223e7f3ab01136','98fd4eacb7e96d7a8c5204e66fcc020c36bb23c5ed8ce88546a08ad83a46e97dc6547e3c56b88149cc190c1f1d66b2f0','hilowscobina8vwv@hotmail.com','c0f0e383b08b2762605516018e529f1f','hilowscobina8vwv0429@fviainboxes.com','977561594769936','bm_die',NULL,'431559dc315555293e599a955d834fa58c3ebbd4e46fbb9c9ba93d5bcb21029b','5097a6ee3198029e701da00c16cb24c0dfe48b67bbe57d20a0fae59f6cf05bf2','2026-05-04 21:29:45','2026-05-05 02:52:57'),(5,'61577206059946','23180e120fce61862d31f92203aaa4e61eea8ea0d02fce2cb0223e7f3ab01136','98fd4eacb7e96d7a8c5204e66fcc020c36bb23c5ed8ce88546a08ad83a46e97dc6547e3c56b88149cc190c1f1d66b2f0','hilowscobina8vwv@hotmail.com','c0f0e383b08b2762605516018e529f1f','hilowscobina8vwv0429@fviainboxes.com','1493439349111819','bm_die',NULL,'431559dc315555293e599a955d834fa58c3ebbd4e46fbb9c9ba93d5bcb21029b','5097a6ee3198029e701da00c16cb24c0dfe48b67bbe57d20a0fae59f6cf05bf2','2026-05-05 02:31:09','2026-05-08 11:51:07'),(6,'61577385282128','1e4f115d67ab8708b1d001f51096d5b0','fac3d6433e91818b5b16728600e00d9a84efaeb52e0a169d3b5dbea0c49b57ab1d6cfbf05746dc73da7b87ddd34e0706','marilyndeshields11lod@hotmail.com','1d0199e25095e2f8c6aa3d2aab59b1227234f98c929d09ad1189041444049638','marilyndeshields11lod2506@fviainboxes.com','1486523186270085','bm_die',NULL,'5ecd26d925f130d2474030f8ce904c9f295a4637a10b44b018c2f2ac5baf8534','d163d91663b27e9f9b616a490b87fbdfc8b70cf1985531d99970d5fd63ae89ac','2026-05-06 22:04:34','2026-05-11 22:10:17'),(9,'61576198164899','9733acbf9cd88d6be5747f2d0ca35176','8ac60263128d92748ae284d873c1734a88307464466a2d3f8ad8961e0fbd4f0459980cd875a09f4924c34f5073e7dd05','sankovichvonruden0288@outlook.com','98b5e2f3ba576b11fb9ffaaa8f668bc8','sankovichvonruden02880205@fviainboxes.com','966618305914195','main_die',NULL,'677e811f7307c81dbdc1d00adcc79259d720c58e36fdba1c012259d9d47b1bd6','840a4e58bed636c1c49b34002cb5db0dd42ea0194f0100b0119a0d27f15a319f','2026-05-08 12:19:00','2026-05-09 04:27:29'),(10,'61577206059946','23180e120fce61862d31f92203aaa4e61eea8ea0d02fce2cb0223e7f3ab01136','98fd4eacb7e96d7a8c5204e66fcc020c36bb23c5ed8ce88546a08ad83a46e97dc6547e3c56b88149cc190c1f1d66b2f0','hilowscobina8vwv@hotmail.com','c0f0e383b08b2762605516018e529f1f','hilowscobina8vwv0429@fviainboxes.com','27695246690063711','bm_die',NULL,'431559dc315555293e599a955d834fa58c3ebbd4e46fbb9c9ba93d5bcb21029b','5097a6ee3198029e701da00c16cb24c0dfe48b67bbe57d20a0fae59f6cf05bf2','2026-05-08 13:50:01','2026-05-11 22:10:12'),(11,'61576223453244','c159f178a00591df8b53ecaa64a6926d','ad3ab5112dd5c4408a3639f2d790c5e73dc5d24a59fbd7b27fbbb5b41514012b84b67dc1150cad62c29b9806f82260b6','jonnieisales17@outlook.com','e8ca6c5830a7dd3b66770a1c9a0a2c56','jonnieisales170205@fviainboxes.com','966618305914195','main_die',NULL,'4f367a2a2df3c360d00d9a7d574e1ea2b73e2948f78bfb29c14c900b8305ae0f','7dd8f08454e974607f3d03cd1e506d17a532105c637952797b8c2708c3ffdf57','2026-05-10 10:20:04','2026-05-10 13:33:23'),(12,'61576723122787','4e7c9ef15965ffb37cad5e8c292cc0882a320863c02fcde936f13090b48c60cf','9f20ccf0afc4cc6dc9cc0ea2ac659524adbad72bb297e96dccfb08138beda553268da075d7920cd9045c2f0c3638dbd7','shelbyma9314@hotmail.com','bdc74356c6a7daf854697b617c6fedecc0afc9203172b9cbdbf974968996f052','shelbyma93140205@fviainboxes.com','966618305914195','bm_die',NULL,'6b1529a2ab5bc2fabd19c1bc759aa1fd29f4c6546ac342f1b3997657c09a49b4','8160403eec5f9b9c7483f7fc655d79dc3846be18eb1b8e27e657e262b1a94787','2026-05-10 13:34:48','2026-05-11 22:10:06'),(15,'61577206059946','23180e120fce61862d31f92203aaa4e61eea8ea0d02fce2cb0223e7f3ab01136','98fd4eacb7e96d7a8c5204e66fcc020c36bb23c5ed8ce88546a08ad83a46e97dc6547e3c56b88149cc190c1f1d66b2f0','hilowscobina8vwv@hotmail.com','c0f0e383b08b2762605516018e529f1f','hilowscobina8vwv0429@fviainboxes.com','1978402059463369','main_die',NULL,'431559dc315555293e599a955d834fa58c3ebbd4e46fbb9c9ba93d5bcb21029b','5097a6ee3198029e701da00c16cb24c0dfe48b67bbe57d20a0fae59f6cf05bf2','2026-05-12 04:38:25','2026-05-13 21:58:27'),(16,'61577385282128','1e4f115d67ab8708b1d001f51096d5b0','fac3d6433e91818b5b16728600e00d9a84efaeb52e0a169d3b5dbea0c49b57ab1d6cfbf05746dc73da7b87ddd34e0706','marilyndeshields11lod@hotmail.com','1d0199e25095e2f8c6aa3d2aab59b1227234f98c929d09ad1189041444049638','marilyndeshields11lod2506@fviainboxes.com','2173798270020955','active',NULL,'5ecd26d925f130d2474030f8ce904c9f295a4637a10b44b018c2f2ac5baf8534','d163d91663b27e9f9b616a490b87fbdfc8b70cf1985531d99970d5fd63ae89ac','2026-05-12 04:38:48','2026-05-12 04:38:48'),(17,'61576723122787','4e7c9ef15965ffb37cad5e8c292cc0882a320863c02fcde936f13090b48c60cf','9f20ccf0afc4cc6dc9cc0ea2ac659524adbad72bb297e96dccfb08138beda553268da075d7920cd9045c2f0c3638dbd7','shelbyma9314@hotmail.com','bdc74356c6a7daf854697b617c6fedecc0afc9203172b9cbdbf974968996f052','shelbyma93140205@fviainboxes.com','1333219238667517','main_die',NULL,'6b1529a2ab5bc2fabd19c1bc759aa1fd29f4c6546ac342f1b3997657c09a49b4','8160403eec5f9b9c7483f7fc655d79dc3846be18eb1b8e27e657e262b1a94787','2026-05-12 04:39:04','2026-05-15 05:28:56'),(18,'61575756521959','ee21d8e477ee1b55c4f732113cbd16f5','eb6d410a6c871349b52c0ffaec37165a7eec2d1141fb4ee9867fdc761f2971dc995e89fc9862972512edc4b8e74e65f5','kishimotohallett7203@outlook.com','4053da202ad08f086c0fce19ef5cb5d4','kishimotohallett72031005@fviainboxes.com','1978402059463369','main_die',NULL,'06e5683431cb8447c28780b7c9299b909bd01a77557f7c06c15549239f722f4f','ac3dcdfce3f7640375d1dfdb392566483b2ab48d977c289c1800c30679058b6d','2026-05-13 21:57:57','2026-05-15 05:15:26'),(19,'61576892255024','31671b7dee3eed97c010c1036ff18dd0e7a615546d35bb7482d4ad0e9d77aca6','b0e09d206614524bdb3fb04766a405cf2cede3b30062c404ca95202857fb6e64d80229c00d8ebcfb8f53f96e292aeb8a','lenlajambor9197@hotmail.com','158c024c81dfbab1d4a2a9a7b74f32e9e655c265b30fd5079f4f257cc23de4a5','lenlajambor91970205@fviainboxes.com','1978402059463369','active',NULL,'5cb21faed538e095569a67457e12293a458cdc97b70b003917967c018967d5b3','64c70578faa1d947ffb1dd079f99c58e7d3ed956e42ba0cf44247eec075c509e','2026-05-15 05:15:16','2026-05-15 05:15:16'),(20,'61576147530536','f5b2323b6d49c4719c0fe8d8d1f3ebaa','2cc56d8297c894413202be8692719eeac0e7bc4b26ab8ed5028b57b472fd72c6ef24423650bb56199190a43181cd630d','dqzhwio911@hotmail.com','0072b7e53e2bd5f80294c0521aa6a016','dqzhwio9111005@fviainboxes.com','800865429573521','active',NULL,'53c46b291bdeab86dd6e7eac5aa49d12010eacd1b69d70275459887988a7daca','8726fae36cd9d89c96d87d8ddc96c03d4c74a4b2d47e36c6ea6f830e0abd8582','2026-05-15 05:29:28','2026-05-15 05:29:28');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cards` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(25) DEFAULT NULL,
  `exp` varchar(10) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `remark` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cvv` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`),
  UNIQUE KEY `number_2` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (1,'5577557231766461','01/32','019','active','main','2026-05-04 18:43:25',NULL),(2,'5577559410262403','03/33','869','inactive',NULL,'2026-05-04 18:47:12',NULL),(4,'5577559410128067','04/33','208','active',NULL,'2026-05-04 18:47:31',NULL),(5,'5577559409208607','04/33','944','active',NULL,'2026-05-04 18:47:40',NULL),(6,'5577559411535757','05/33','067','active',NULL,'2026-05-12 06:34:05',NULL),(7,'5577559408896808','04/33','917','active',NULL,'2026-05-12 06:35:20',NULL);
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `links`
--

DROP TABLE IF EXISTS `links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `links` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `link_name` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `link` text CHARACTER SET utf8mb4 NOT NULL,
  `status` enum('Active','Inactive') CHARACTER SET utf8mb4 NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `remark` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `links`
--

LOCK TABLES `links` WRITE;
/*!40000 ALTER TABLE `links` DISABLE KEYS */;
INSERT INTO `links` VALUES (4,'OneMK88','https://salepagea02.com/Omkssv2','Active','2026-05-17 02:23:15','2026-05-17 02:23:15','ยิง UTM 1'),(5,'OneMK88','https://salepagea02.com/agnOmkssv2','Active','2026-05-17 02:23:44','2026-05-17 02:23:44','ยิง UTM 2');
/*!40000 ALTER TABLE `links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `page_id` varchar(100) NOT NULL,
  `agen` varchar(100) DEFAULT NULL,
  `page_name` varchar(150) DEFAULT NULL,
  `status` enum('active','page_die') DEFAULT 'active',
  `remark` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_page_id` (`page_id`),
  KEY `idx_agen` (`agen`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'808993648955401','527940840937327','Karla Stewart','active','','2026-05-04 18:51:22'),(2,'780052158522076','142386075606293','Gail Fisher','active','','2026-05-04 18:51:47'),(3,'1105667272622453','142386075606293','Caroline Montgomery','active','','2026-05-04 18:58:58'),(4,'101991305555750','705662481348522','Phương Mai','active','','2026-05-04 18:59:11'),(5,'1067377279794703','705662481348522','Paul Johnson','page_die','','2026-05-04 18:59:37'),(6,'1150508538134772','705662481348522','Thomas Grace Johnson','page_die','','2026-05-04 18:59:45'),(7,'1126410903892601','','','active','','2026-05-12 04:39:42'),(8,'1141719219017803','1391181998381579','Matthew Garcia','active','','2026-05-12 08:30:20');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pixels`
--

DROP TABLE IF EXISTS `pixels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pixels` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `px_id` varchar(100) NOT NULL,
  `agen1` varchar(100) DEFAULT NULL,
  `agen2` varchar(100) DEFAULT NULL,
  `token` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_px_id` (`px_id`),
  KEY `idx_agen1` (`agen1`),
  KEY `idx_agen2` (`agen2`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pixels`
--

LOCK TABLES `pixels` WRITE;
/*!40000 ALTER TABLE `pixels` DISABLE KEYS */;
INSERT INTO `pixels` VALUES (1,'1751156656293833','1453976496412467','705662481348522','02a87e19bf91bea0ee8ec9f4e5771e7139d253fd3bf41c9048a232f6ca8e296273f59841c3c1720ffbf418b2c292ca7f912fa83e85856e05766462bd94615c2653e6b13432ca30ad879996ad1701415dc2e269bb62f33c3f6da7e8e408ae566c5c3c8f481f1b542f5cfa4939332b8cfc36941fb0a7d7affaac6a0142f7769d9fa51cd2bce5423b72d15bb5405051275ff56f78b97d5b670432d740f3cc8cabd43203adfc88648637266227bc9cc8a2aab105b2da8d9f64e4d774fbedade74ea9eadc73df1d32d1a5a1827392d722408d','inactive','2026-05-04 18:30:32'),(2,'1262467879435092','3719363101552963','1391181998381579','19d66036e5bbf8705dff719d024e44d7ebf4267e72061772f7e43c94adf4befa2d6ce98d25615fb78afcab63743e0fa0381ff4df08a97aaf960994fba2513a7bd299155cc830dbd9ab310eef145726e4d8258bc96b0f60350bf5fedb7a06ba4f7ab203346387491013eeeff9818177de400cc76391db74d7046f3a5130435398669c24b0fe9c0094b6be17b2c4086594a89fb6c6c95ec8d42d78c99de10c4dd2123b23d80393bb42d932a40d5ac8624809b7437e15dd1a6ded05eb0dcd2a3f29716b66325dd669d5700ba728b3f9c9b8','active','2026-05-09 02:54:01'),(3,'1470531647634333','BM sup01','','525735b48f8952b2776863179f53c51ee667510c28ac6fd97abe820e8dfcff65687b85ece309274c1bd3ecaffb76202e608fd762576a680196666a3c82906d0093a2438ee56cc2bcbd789d7a0969ff7c1091bc1cfcf24564168c45e18630cc5beaba4e8119b587b5f42a5012175a2d8c7faf94d5a91ffa6b0cc370112b0b612d254fb2682af1dabfe2079d8f8b9691c16e82b325217f15a6c2ea652907f540020c8f8aa73f87fd4b9625c3da8873f9a3ab8bd081f58e9345a85436c51d2cbee4ab9b46e86398cab4fd18a4b283491e89','active','2026-05-17 00:23:06');
/*!40000 ALTER TABLE `pixels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `slug` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `color` varchar(20) CHARACTER SET utf8mb4 DEFAULT '#3b82f6',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 DEFAULT 'active',
  `remark` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`tag_name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'admin1','admin-tag','#ff0000',NULL,NULL,'2026-05-16 23:33:12','2026-05-16 23:36:23');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff') DEFAULT 'staff',
  `status` enum('active','disabled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$TzazVjKpuVvDwLE3voVdPuaWXGNrrBFWu7Sud5/gBjFR/ML3pOd8u','admin','active','2026-05-07 00:37:01','2026-05-07 00:37:01');
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

-- Dump completed on 2026-05-17  7:16:54
