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

 Date: 25/02/2024 23:18:55
*/


-- ----------------------------
-- Table structure for systems
-- ----------------------------
DROP TABLE IF EXISTS "public"."systems";
CREATE TABLE "public"."systems" (
  "id" "pg_catalog"."int4" NOT NULL DEFAULT nextval('systems_id_seq'::regclass),
  "app_id" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" NOT NULL,
  "app_name" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" NOT NULL,
  "create_time" "pg_catalog"."timestamptz" NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "app_type" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of systems
-- ----------------------------
INSERT INTO "public"."systems" VALUES (4, '1', '1', '2024-02-25 23:01:41.709189+08', 'Win32');

-- ----------------------------
-- Primary Key structure for table systems
-- ----------------------------
ALTER TABLE "public"."systems" ADD CONSTRAINT "systems_pkey" PRIMARY KEY ("id");
