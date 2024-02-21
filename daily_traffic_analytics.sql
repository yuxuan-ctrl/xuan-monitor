CREATE TABLE daily_traffic_analytics (
                                         id VARCHAR(255) PRIMARY KEY,
                                         date DATE NOT NULL,
                                         most_visited_page_id VARCHAR(255) NOT NULL,
                                         most_visited_page_views BIGINT NOT NULL,
                                         total_stay_duration DOUBLE PRECISION NOT NULL,
                                         average_stay_duration DOUBLE PRECISION NOT NULL,
                                         total_page_views BIGINT NOT NULL,
                                         unique_visitors INTEGER NOT NULL,
                                         create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 为列添加注释
COMMENT ON COLUMN daily_traffic_analytics.id IS 'Unique identifier, generated automatically';
COMMENT ON COLUMN daily_traffic_analytics.date IS 'The date of the analytics data';
COMMENT ON COLUMN daily_traffic_analytics.most_visited_page_id IS 'The ID of the page with the most visits on that day';
COMMENT ON COLUMN daily_traffic_analytics.most_visited_page_views IS 'Number of views for the most visited page on that day';
COMMENT ON COLUMN daily_traffic_analytics.total_stay_duration IS 'Total time spent by all users on the site';
COMMENT ON COLUMN daily_traffic_analytics.average_stay_duration IS 'Average time spent per visit by each user';
COMMENT ON COLUMN daily_traffic_analytics.total_page_views IS 'Total number of page views on that day';
COMMENT ON COLUMN daily_traffic_analytics.unique_visitors IS 'Number of distinct visitors to the site on that day';
COMMENT ON COLUMN daily_traffic_analytics.create_time IS 'Timestamp indicating when this record was created';