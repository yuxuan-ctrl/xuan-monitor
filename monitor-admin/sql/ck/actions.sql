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
ORDER BY timestamp
SETTINGS index_granularity = 8192;