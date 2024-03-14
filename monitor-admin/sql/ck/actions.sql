CREATE TABLE IF NOT EXISTS action_info
(
    app_id
    String,
    user_id
    String,
    `type`
    String,
    data
    String, -- 假设data已经被转换为JSON字符串存储在这里
    timestamp
    DateTime
(
    'Asia/Shanghai'
),
    create_time DateTime
    ) ENGINE = MergeTree
(
)
    ORDER BY
(
    timestamp
);