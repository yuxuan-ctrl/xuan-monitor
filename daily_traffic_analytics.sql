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

 Date: 17/02/2024 23:42:21
*/


-- ----------------------------
-- Table structure for daily_traffic_analytics
-- ----------------------------
DROP TABLE IF EXISTS "public"."daily_traffic_analytics";
CREATE TABLE "public"."daily_traffic_analytics" (
  "id" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" NOT NULL,
  "date" "pg_catalog"."date" NOT NULL,
  "most_visited_page_id" "pg_catalog"."varchar" COLLATE "pg_catalog"."default",
  "most_visited_page_views" "pg_catalog"."int8",
  "total_stay_duration" "pg_catalog"."float8",
  "average_stay_duration" "pg_catalog"."float8",
  "total_page_views" "pg_catalog"."int8",
  "unique_page_views" "pg_catalog"."int4",
  "platform_distribution" "pg_catalog"."varchar" COLLATE "pg_catalog"."default",
  "screen_resolution_distribution" "pg_catalog"."varchar" COLLATE "pg_catalog"."default",
  "create_time" "pg_catalog"."timestamp" NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Primary Key structure for table daily_traffic_analytics
-- ----------------------------
ALTER TABLE "public"."daily_traffic_analytics" ADD CONSTRAINT "daily_traffic_analytics_pkey" PRIMARY KEY ("id");
