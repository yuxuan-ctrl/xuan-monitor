-- public.systems definition

-- Drop table

-- DROP TABLE public.systems;

CREATE TABLE public.systems (
                                app_id varchar(255) NULL,
                                app_name varchar(255) NULL,
                                app_type varchar(255) NULL,
                                create_time timestamp NULL,
                                is_use int4 NOT NULL,
                                CONSTRAINT systems_pkey PRIMARY KEY (id)
);