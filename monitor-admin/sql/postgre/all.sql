CREATE TABLE users (
                       user_id VARCHAR(255) NOT NULL,
                       create_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                       last_login_time TIMESTAMP WITHOUT TIME ZONE,
                       ip_address VARCHAR(255),
                       platform VARCHAR(255),
                       user_agent VARCHAR(255),
                       location VARCHAR(255),
                       belong_city VARCHAR(255),
                       PRIMARY KEY (user_id)
);

CREATE TABLE systems (
                         app_id VARCHAR(255) NOT NULL,
                         app_name VARCHAR(255),
                         create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                         app_type VARCHAR(255),
                         PRIMARY KEY (app_id)
);

CREATE TABLE errors (
                        error_type VARCHAR(255) NOT NULL,
                        error_message TEXT,
                        es_error_id VARCHAR(255),
                        timestamp TIMESTAMP WITHOUT TIME ZONE,
                        url VARCHAR(255),
                        app_id VARCHAR(255),
                        user_id VARCHAR(255),
                        create_time VARCHAR(255),
                        is_resolved INTEGER,
                        PRIMARY KEY (error_type, es_error_id)
);