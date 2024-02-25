/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 160000
 Source Host           : localhost:5432
 Source Catalog        : monitor
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 160000
 File Encoding         : 65001

 Date: 25/02/2024 23:19:06
*/


-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "user_id" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" NOT NULL,
  "create_time" "pg_catalog"."timestamp" NOT NULL,
  "ip_address" "pg_catalog"."varchar" COLLATE "pg_catalog"."default",
  "platform" "pg_catalog"."varchar" COLLATE "pg_catalog"."default",
  "user_agent" "pg_catalog"."text" COLLATE "pg_catalog"."default",
  "last_login_time" "pg_catalog"."timestamp" NOT NULL,
  "location" "pg_catalog"."varchar" COLLATE "pg_catalog"."default",
  "all_users_length" "pg_catalog"."_int4"
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES ('f1e790edf25378bcbec2a103f2e84906', '2024-02-24 08:55:56.547906', '0:0:0:0:0:0:0:1', 'Win32', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0', '2024-02-25 23:01:57.058447', '{"latitude":23.227093,"longitude":113.29659}', NULL);

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pk" PRIMARY KEY ("user_id");
