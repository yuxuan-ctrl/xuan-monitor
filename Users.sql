-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
                              user_id varchar(255) NOT NULL,
                              create_time timestamp NOT NULL,
                              ip_address varchar(45) NULL,
                              platform varchar(255) NULL,
                              user_agent text NULL,
                              last_login_time timestamp NOT NULL,
                              "location" varchar(255) NULL,
                              all_users_length _int4 NULL,
                              CONSTRAINT users_pk PRIMARY KEY (user_id)
);