-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
                              user_name varchar(255) NOT NULL,
                              pass_word varchar(255) NOT NULL,
                              system_ids varchar(255) NOT NULL,
                              is_use int4 NULL,
                              "level" int4 NULL,
                              "token" varchar(255) NOT NULL,
                              usertoken varchar(255) NULL,
                              create_time date NULL,
                              id int4 NOT NULL,
                              CONSTRAINT users_pkey PRIMARY KEY (user_name, token, id)
);