-- public.errors definition

-- Drop table

-- DROP TABLE public.errors;

CREATE TABLE public.errors (
                               id serial4 NOT NULL,
                               es_error_id varchar(36) NOT NULL,
                               "timestamp" timestamptz NOT NULL,
                               error_message varchar(200) NOT NULL,
                               app_id varchar(255) NULL,
                               error_type varchar(50) NOT NULL,
                               user_id varchar(36) NULL,
                               url varchar(50) NULL,
                               user_agent varchar(50) NULL,
                               created_at timestamptz DEFAULT now() NOT NULL,
                               updated_at timestamptz DEFAULT now() NOT NULL,
                               CONSTRAINT errors_es_error_id_key UNIQUE (es_error_id),
                               CONSTRAINT errors_pkey PRIMARY KEY (id)
);