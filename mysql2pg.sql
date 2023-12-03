CREATE TABLE "systems" (
  "id" int4 NOT NULL,
  "type" varchar(10) NOT NULL,
  "is_use" int4 NOT NULL,
  "app_id" varchar(255),
  "system_name" varchar(255),
  "system_domain" varchar(255),
  "create_time" timestamp,
  PRIMARY KEY ("id")
);

CREATE TABLE "users" (
  "user_name" varchar(255) NOT NULL,
  "pass_word" varchar(255) NOT NULL,
  "system_ids" varchar(255) NOT NULL,
  "is_use" int4,
  "level" int4,
  "token" varchar(255) NOT NULL,
  "usertoken" varchar(255),
  "create_time" date,
  "id" int4 NOT NULL,
  PRIMARY KEY ("user_name", "token", "id")
);
COMMENT ON COLUMN "users"."user_name" IS '用户名称';
COMMENT ON COLUMN "users"."pass_word" IS '用户密码';
COMMENT ON COLUMN "users"."system_ids" IS '用户所拥有的系统Id';
COMMENT ON COLUMN "users"."is_use" IS '是否禁用 0：正常  1：禁用';
COMMENT ON COLUMN "users"."level" IS '用户等级（0：管理员，1：普通用户）';
COMMENT ON COLUMN "users"."token" IS '用户秘钥';
COMMENT ON COLUMN "users"."usertoken" IS '用户登录态秘钥';
COMMENT ON COLUMN "users"."create_time" IS '用户访问时间';

CREATE TABLE "webpvuv" (
  "app_id" varchar(255) NOT NULL,
  "pv" int4,
  "uv" int4,
  "create_time" timestamp,
  "type" varchar(255),
  "page_url" varchar(255),
  PRIMARY KEY ("app_id")
);

