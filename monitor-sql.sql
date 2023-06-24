/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 80026
Source Host           : localhost:3306
Source Database       : monitor

Target Server Type    : MYSQL
Target Server Version : 80026
File Encoding         : 65001

Date: 2023-06-25 00:14:04
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for systems
-- ----------------------------
DROP TABLE IF EXISTS `systems`;
CREATE TABLE `systems` (
  `id` int NOT NULL,
  `type` varchar(10) NOT NULL,
  `is_use` int NOT NULL,
  `app_id` varchar(255) DEFAULT NULL,
  `system_name` varchar(255) DEFAULT NULL,
  `system_domain` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of systems
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名称',
  `pass_word` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '用户密码',
  `system_ids` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户所拥有的系统Id',
  `is_use` int DEFAULT NULL COMMENT '是否禁用 0：正常  1：禁用',
  `level` int DEFAULT NULL COMMENT '用户等级（0：管理员，1：普通用户）',
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户秘钥',
  `usertoken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '用户登录态秘钥',
  `create_time` date DEFAULT NULL COMMENT '用户访问时间',
  `id` int NOT NULL,
  PRIMARY KEY (`user_name`,`token`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('asd', 'asdas', 'asda', '123', '123', 'asdas', 'asdas', '2023-06-01', '1');

-- ----------------------------
-- Table structure for webpvuv
-- ----------------------------
DROP TABLE IF EXISTS `webpvuv`;
CREATE TABLE `webpvuv` (
  `app_id` varchar(255) NOT NULL,
  `pv` int DEFAULT NULL,
  `uv` int DEFAULT NULL,
  `create_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `type` varchar(255) DEFAULT NULL,
  `page_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of webpvuv
-- ----------------------------
