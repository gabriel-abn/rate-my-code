drop schema if exists public cascade;

create schema public;

--
drop table if exists user cascade;

create table user (
  id varchar(16) not null,
  password varchar(255) not null,
  email varchar(255) not null,
  email_verified boolean default false,
  role varchar(255) default 'DEVELOPER',
  created_at timestamp not null default current_timestamp,
  -- 
  constraint "user_pkey" primary key (id)
);

--
drop table if exists developer cascade;

create table developer(
  id varchar(16),
  user_id varchar(16) not null,
  created_at timestamp not null default current_timestamp,
  -- 
  constraint "developer_pkey" primary key (id, user_id),
  --
  constraint "developer_user_id_fkey" foreign key (user_id) references "user" (id) on delete cascade
);

--
drop table if exists instructor cascade;

create table instructor(
  id varchar(16) not null,
  user_id varchar(16) not null,
  created_at timestamp not null default current_timestamp,
  -- 
  constraint "instructor_pkey" primary key (id, user_id),
  --
  constraint "instructor_user_id_fkey" foreign key (user_id) references "user" (id) on delete cascade
);

--
drop table if exists profile cascade;

create table profile (
  id varchar(16) not null,
  first_name varchar(255) not null,
  last_name varchar(255),
  avatar_url varchar(255),
  user_id varchar(16) not null,
  created_at timestamp not null default current_timestamp,
  -- 
  constraint "profile_pkey" primary key (id),
  --
  constraint "profile_user_id_fkey" foreign key (user_id) references "user" (id) on delete cascade
);

--
drop table if exists post cascade;

create table post (
  id varchar(16) not null,
  title varchar(255) not null,
  content text not null,
  tags varchar(255) [],
  user_id varchar(16) not null,
  created_at timestamp not null default current_timestamp,
  -- 
  constraint "post_pkey" primary key (id),
  --
  constraint "post_user_id_fkey" foreign key (user_id) references "user" (id) on delete cascade
);

--
drop table if exists feedback cascade;

create table feedback (
  id varchar(16) not null,
  content text not null,
  rating int default 0,
  user_id varchar(16) not null,
  post_id varchar(16) not null,
  created_at timestamp not null default current_timestamp,
  -- 
  constraint "feedback_pkey" primary key (id),
  --
  constraint "feedback_user_id_fkey" foreign key (user_id) references "user" (id) on delete cascade,
  constraint "feedback_post_id_fkey" foreign key (post_id) references "post" (id) on delete cascade
);