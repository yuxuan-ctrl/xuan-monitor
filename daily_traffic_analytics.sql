CREATE TABLE metrics (
                                         id VARCHAR(255) PRIMARY KEY,
                                         date DATE NOT NULL,
                                         most_visited_page_id VARCHAR(255) NOT NULL,
                                         most_visited_page_views BIGINT NOT NULL,
                                         total_stay_duration DOUBLE PRECISION NOT NULL,
                                         average_stay_duration DOUBLE PRECISION NOT NULL,
                                         total_page_views BIGINT NOT NULL,
                                         unique_visitors INTEGER NOT NULL,
                                         create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         most_frequent_platform VARCHAR(255) NOT NULL,
                                         most_frequent_screen_resolution VARCHAR(255) NOT NULL
);

-- 为列添加注释
COMMENT ON COLUMN metrics.id IS 'Unique identifier, generated automatically';
COMMENT ON COLUMN metrics.date IS 'The date of the analytics data';
COMMENT ON COLUMN metrics.most_visited_page_id IS 'The ID of the system with the most visits on that range time';
COMMENT ON COLUMN metrics.most_visited_page_views IS 'Number of views for the most visited page on that day';
COMMENT ON COLUMN metrics.total_stay_duration IS 'Total time spent by all users on the site';
COMMENT ON COLUMN metrics.average_stay_duration IS 'Average time spent per visit by each user';
COMMENT ON COLUMN metrics.total_page_views IS 'Total number of page views on that day';
COMMENT ON COLUMN metrics.unique_visitors IS 'Number of distinct visitors to the site on that day';
COMMENT ON COLUMN metrics.create_time IS 'Timestamp indicating when this record was created';
COMMENT ON COLUMN metrics.most_frequent_platform IS 'The platform of the system with the most visits on that range time';
COMMENT ON COLUMN metrics.most_frequent_screen_resolution IS 'The screen_resolution of the system with the most visits on that range time';