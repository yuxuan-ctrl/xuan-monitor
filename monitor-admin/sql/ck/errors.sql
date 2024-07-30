-- `default`.error_info definition

CREATE TABLE default.error_info
(

    `error_type` String,

    `error_message` String,

    `stack_trace` String,

    `user_agent` String,

    `timestamp` DateTime('Asia/Shanghai'),

    `create_time` DateTime('Asia/Shanghai'),

    `app_id` String,

    `user_id` String,

    `request_url` String,

    `error_id` String,

    `record` String,

    `page_url` String
)
    ENGINE = MergeTree
ORDER BY timestamp
SETTINGS index_granularity = 8192,
 parts_to_delay_insert = 60000,
 parts_to_throw_insert = 60000;