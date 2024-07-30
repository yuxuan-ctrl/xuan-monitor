-- `default`.action_info definition

CREATE TABLE default.action_info
(

    `app_id` String,

    `user_id` String,

    `type` String,

    `data` String,

    `timestamp` DateTime('Asia/Shanghai'),

    `create_time` DateTime,

    `id` String,

    `page_url` String
)
    ENGINE = MergeTree
PARTITION BY toYYYYMMDD(timestamp)
ORDER BY (timestamp,
 app_id,
 user_id)
SETTINGS index_granularity = 8192,
    parts_to_delay_insert = 60000,
 parts_to_throw_insert = 60000;