DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;

--
DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
  id VARCHAR(16) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  email_verified boolean DEFAULT false,
  username VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT 'developer',
  tags VARCHAR(255) [],
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  --
  CONSTRAINT "user_pkey" PRIMARY KEY (id)
);

--
DROP TABLE IF EXISTS developer CASCADE;

CREATE TABLE developer (
  id VARCHAR(16),
  user_id VARCHAR(16) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  --
  CONSTRAINT "developer_pkey" PRIMARY KEY (id, user_id),
  --
  CONSTRAINT "developer_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
);

--
DROP TABLE IF EXISTS instructor CASCADE;

CREATE TABLE instructor (
  id VARCHAR(16) NOT NULL,
  user_id VARCHAR(16) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  --
  CONSTRAINT "instructor_pkey" PRIMARY KEY (id, user_id),
  --
  CONSTRAINT "instructor_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
);

--
DROP TABLE IF EXISTS profile CASCADE;

CREATE TABLE profile (
  id VARCHAR(16) NOT NULL,
  first_name VARCHAR(255) DEFAULT '',
  last_name VARCHAR(255) DEFAULT '',
  avatar_url VARCHAR(255) DEFAULT '',
  user_id VARCHAR(16) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  --
  CONSTRAINT "profile_pkey" PRIMARY KEY (id),
  --
  CONSTRAINT "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
);

--
DROP TABLE IF EXISTS post CASCADE;

CREATE TABLE post (
  id VARCHAR(16) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags VARCHAR(255),
  user_id VARCHAR(16) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  --
  CONSTRAINT "post_pkey" PRIMARY KEY (id),
  --
  CONSTRAINT "post_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
);

--
DROP TABLE IF EXISTS feedback CASCADE;

CREATE TABLE feedback (
  id VARCHAR(16) NOT NULL,
  content TEXT NOT NULL,
  rating INT DEFAULT 0,
  rates_count INT DEFAULT 0,
  user_id VARCHAR(16) NOT NULL,
  post_id VARCHAR(16) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  --
  CONSTRAINT "feedback_pkey" PRIMARY KEY (id),
  --
  CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE,
  CONSTRAINT "feedback_post_id_fkey" FOREIGN KEY (post_id) REFERENCES "post" (id) ON DELETE CASCADE
);

CREATE VIEW posts_view as
SELECT
  p.id,
  p.title,
  p.content,
  p.tags,
  p.user_id AS "userId",
  count(f.id) AS feedbacks
FROM
  post p
  LEFT JOIN feedback f ON p.id = f.post_id
GROUP BY
  p.id;