CREATE TABLE IF NOT EXISTS error_info
(
    error_type
    String,
    error_message
    String,
    stack_trace
    String,
    user_agent
    String,
    timestamp
    DateTime
(
    'Asia/Shanghai'
),
    create_time DateTime
(
    'Asia/Shanghai'
),
    app_id String,
    user_id String,
    url String,
    request_url String,
    record_data String -- 假设record已经被转换为JSON字符串存储在这里
    ) ENGINE = MergeTree
(
)
    ORDER BY
(
    timestamp
);