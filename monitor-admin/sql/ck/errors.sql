CREATE TABLE errors (
                        errorType String,
                        errorMessage String,
                        stackTrace String,
                        userAgent String,
                        timestamp DateTime64(3), -- Assuming Timestamp is in milliseconds
                        createTime DateTime, -- If 'JsonFormat' annotation implies this is also a timestamp in yyyy-MM-dd HH:mm:ss format
                        appId String,
                        userId String,
                        url String,
                        requestUrl String,
                        record Array(String)
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(createTime) -- Optionally partition by date if that's useful for your queries
ORDER BY (createTime);