-- `default`.interface_info definition

CREATE TABLE default.interface_info
(

    `id` String,

    `user_id` String,

    `app_id` String,

    `method` String,

    `create_time` DateTime('Asia/Shanghai'),

    `request_url` String,

    `page_url` String,

    `timestamp` Int64,

    `duration` Float64,

    `body` String,

    `headers` String,

    `response` String,

    `status` Int32
)
    ENGINE = MergeTree
ORDER BY (id,
 timestamp)
SETTINGS parts_to_delay_insert = 60000,
 parts_to_throw_insert = 60000,
 index_granularity = 8192;