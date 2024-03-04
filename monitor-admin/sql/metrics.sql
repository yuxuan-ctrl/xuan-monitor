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

 Date: 25/02/2024 23:18:48
*/


-- ----------------------------
-- Table structure for metrics
-- ----------------------------
DROP TABLE IF EXISTS "public"."metrics";
CREATE TABLE "public"."metrics" (
  "id" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" NOT NULL,
  "date" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" NOT NULL,
  "most_visited_page_id" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" NOT NULL,
  "most_visited_page_views" "pg_catalog"."int8" NOT NULL,
  "total_stay_duration" "pg_catalog"."float8" NOT NULL,
  "average_stay_duration" "pg_catalog"."float8" NOT NULL,
  "total_page_views" "pg_catalog"."int8" NOT NULL,
  "unique_visitors" "pg_catalog"."int4" NOT NULL,
  "create_time" "pg_catalog"."varchar" COLLATE "pg_catalog"."default" DEFAULT CURRENT_TIMESTAMP,
  "all_users_length" "pg_catalog"."int4",
  "most_frequent_platform" "pg_catalog"."varchar" COLLATE "pg_catalog"."default",
  "most_frequent_screen_resolution" "pg_catalog"."varchar" COLLATE "pg_catalog"."default"
)
;
COMMENT ON COLUMN "public"."metrics"."id" IS 'Unique identifier, generated automatically';
COMMENT ON COLUMN "public"."metrics"."date" IS 'The date of the analytics data';
COMMENT ON COLUMN "public"."metrics"."most_visited_page_id" IS 'The ID of the page with the most visits on that day';
COMMENT ON COLUMN "public"."metrics"."most_visited_page_views" IS 'Number of views for the most visited page on that day';
COMMENT ON COLUMN "public"."metrics"."total_stay_duration" IS 'Total time spent by all users on the site';
COMMENT ON COLUMN "public"."metrics"."average_stay_duration" IS 'Average time spent per visit by each user';
COMMENT ON COLUMN "public"."metrics"."total_page_views" IS 'Total number of page views on that day';
COMMENT ON COLUMN "public"."metrics"."unique_visitors" IS 'Number of distinct visitors to the site on that day';
COMMENT ON COLUMN "public"."metrics"."create_time" IS 'Timestamp indicating when this record was created';

-- ----------------------------
-- Records of metrics
-- ----------------------------
INSERT INTO "public"."metrics" VALUES ('9dce6f89-802a-49bc-85c2-c92d7ae2210e', '2024-02-23 00:00:00', '/page1', 7, 3673.10000000149, 3673.10000000149, 234, 99, '2024-02-23 00:00:00', 1, 'Win32', 'widthx2752');
INSERT INTO "public"."metrics" VALUES ('ac5fd8c3-832f-41d3-8ec5-832ed6f84039', '2024-02-24 00:00:00', '/page1', 8, 3673.10000000149, 3673.10000000149, 436, 121, '2024-02-24 00:00:00', 1, 'Win32', 'widthx2752');
INSERT INTO "public"."metrics" VALUES ('93472f88-f2ac-4d8b-8ae7-d0a0bf20cc30', '2024-02-25 00:00:00', '/page1', 5, 3673.10000000149, 3673.10000000149, 677, 222, '2024-02-25 00:00:00', 1, 'Win32', 'widthx2752');
INSERT INTO "public"."metrics" VALUES ('bcadb1b5-3774-435b-9a3f-10bebb74e61a', '2024-02-17 00:00:00', '/page1', 1, 24039.79999999702, 6009.949999999255, 12, 12, '2024-02-17 00:00:00', 1, 'Win32', 'widthx2752');
INSERT INTO "public"."metrics" VALUES ('259b4786-3d41-43d6-9c46-56cdbfb734c8', '2024-02-18 00:00:00', '/page1', 2, 24039.79999999702, 6009.949999999255, 22, 22, '2024-02-18 00:00:00', 1, 'Win32', 'widthx2752');
INSERT INTO "public"."metrics" VALUES ('3e3135fe-4d05-480d-a002-0a929370906f', '2024-02-19 00:00:00', '/page1', 3, 24039.79999999702, 6009.949999999255, 32, 34, '2024-02-19 00:00:00', 1, 'Win32', 'widthx2752');
INSERT INTO "public"."metrics" VALUES ('9cfaa61b-b124-424a-aafa-7f9e6f41e21e', '2024-02-20 00:00:00', '/page1', 4, 24039.79999999702, 6009.949999999255, 45, 56, '2024-02-20 00:00:00', 1, 'Win32', 'widthx2752');
INSERT INTO "public"."metrics" VALUES ('bcf650b2-df2a-46e8-9744-422ac67a7d2d', '2024-02-21 00:00:00', '/page1', 5, 24039.79999999702, 6009.949999999255, 67, 78, '2024-02-21 00:00:00', 1, 'Win32', 'widthx2752');
INSERT INTO "public"."metrics" VALUES ('eb1136d1-b32e-46a0-a487-26fd6c1a0d4a', '2024-02-22 00:00:00', '/page1', 6, 3673.10000000149, 3673.10000000149, 89, 88, '2024-02-22 00:00:00', 1, 'Win32', 'widthx2752');

-- ----------------------------
-- Primary Key structure for table metrics
-- ----------------------------
ALTER TABLE "public"."metrics" ADD CONSTRAINT "metrics_pkey" PRIMARY KEY ("id");
