CREATE TABLE event_info
(
    app_id                  String,
    most_visited_page_id    String,
    most_visited_page_views Int32,
    page_url                String,
    user_agent              String,
    platform                String,
    screen_resolution       String,
    timestamp               Int32,
    referrer                String,
    unique_key              String,
    language                String,
    time_zone_offset        Int32,
    name                    String,
    user_id                 String,
    stay_duration           Float64,
    create_time             DateTime,
    metrics                 String,
    slow_resources          String,
    record                  String
) ENGINE = MergeTree()
PARTITION BY toStartOfDay(create_time) -- Partitioning by day based on create_time
ORDER BY (create_time);