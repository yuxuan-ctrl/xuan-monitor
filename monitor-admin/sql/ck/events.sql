CREATE TABLE event_info (
                            app_id String,
                            most_visited_page_id String,
                            most_visited_page_views Int32,
                            page_url String,
                            user_agent String,
                            platform String,
                            screen_resolution String, -- JSON format
                            timestamp DateTime64(3),
                            referrer String,
                            unique_key String,
                            language String,
                            time_zone_offset Int32,
                            name String,
                            user_id String,
                            stay_duration Float64,
                            create_time DateTime,
                            metrics String, -- JSON format
                            slow_resources String, -- JSON format
) ENGINE = MergeTree()
PARTITION BY toStartOfDay(create_time)
ORDER BY (create_time);
