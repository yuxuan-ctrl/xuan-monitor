CREATE TABLE events (
                        appId String,
                        mostVisitedPageId String,
                        mostVisitedPageViews Int32,
                        pageUrl String,
                        userAgent String,
                        platform String,
                        screenResolution Nested (key String, value Int32),
                        timestamp DateTime64(3), -- Assuming Timestamp is in milliseconds and should be stored as DateTime with precision
                        referrer String,
                        uniqueKey String,
                        language String,
                        timeZoneOffset Int32,
                        name String,
                        userId String,
                        stayDuration Float64,
                        createTime DateTime, -- Assuming this is a regular date/time field
                        metrics Nested (key String, value String), -- Depending on the actual types of values, you may need to use other types
                        slowResources Nested (
                            resource Array(Nested(
                            key String,
                            value Nested(key String, value String)
                            ))
                            )
) ENGINE = MergeTree()
PARTITION BY toDate(createTime) -- Optionally partition by date if that's relevant for your use case
ORDER BY (createTime);