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
  CONSTRAINT "profile_pkey" PRIMARY KEY (id, user_id),
  --
  CONSTRAINT "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
);

--
DROP TABLE IF EXISTS post CASCADE;

CREATE TABLE post (
  id VARCHAR(16) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
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
  p.user_id AS "userId",
  count(f.id) AS feedbacks
FROM
  post p
  LEFT JOIN feedback f ON p.id = f.post_id
GROUP BY
  p.id;

CREATE VIEW users_view as
SELECT
  U.id,
  U.email,
  U.password,
  U.username,
  U.email_verified AS "emailVerified",
  R.id AS "roleId",
  u.role,
  p.first_name AS "firstName",
  p.last_name AS "lastName",
  p.avatar_url as "avatar"
FROM
  public.user U
  JOIN (
    (
      SELECT
        *
      FROM
        public.developer D
    )
    UNION
    (
      SELECT
        *
      FROM
        public.instructor I
    )
  ) R ON U.id = R.user_id
  LEFT JOIN public.profile P on U.id = P.user_id;

-- Populate "user" table
INSERT INTO
  "user" (id, email, password, username, email_verified)
VALUES
  (
    '1',
    'john.doe@example.com',
    'password1',
    'johndoe',
    true
  ),
  (
    '2',
    'jane.smith@example.com',
    'password2',
    'janesmith',
    true
  ),
  (
    '3',
    'michael.johnson@example.com',
    'password3',
    'michaeljohnson',
    true
  ),
  (
    '4',
    'emily.brown@example.com',
    'password4',
    'emilybrown',
    true
  ),
  (
    '5',
    'david.davis@example.com',
    'password5',
    'daviddavis',
    true
  ),
  (
    '6',
    'sarah.wilson@example.com',
    'password6',
    'sarahwilson',
    true
  ),
  (
    '7',
    'daniel.anderson@example.com',
    'password7',
    'danielanderson',
    true
  ),
  (
    '8',
    'olivia.martinez@example.com',
    'password8',
    'oliviamartinez',
    true
  ),
  (
    '9',
    'james.taylor@example.com',
    'password9',
    'jamestaylor',
    true
  ),
  (
    '10',
    'sophia.thomas@example.com',
    'password10',
    'sophiathomas',
    true
  );

-- Populate "profile" table
INSERT INTO
  profile (id, first_name, last_name, avatar_url, user_id)
VALUES
  ('1', 'John', 'Doe', 'avatar1.jpg', '1'),
  ('2', 'Jane', 'Smith', 'avatar2.jpg', '2'),
  ('3', 'Michael', 'Johnson', 'avatar3.jpg', '3'),
  ('4', 'Emily', 'Brown', 'avatar4.jpg', '4'),
  ('5', 'David', 'Davis', 'avatar5.jpg', '5'),
  ('6', 'Sarah', 'Wilson', 'avatar6.jpg', '6'),
  ('7', 'Daniel', 'Anderson', 'avatar7.jpg', '7'),
  ('8', 'Olivia', 'Martinez', 'avatar8.jpg', '8'),
  ('9', 'James', 'Taylor', 'avatar9.jpg', '9'),
  ('10', 'Sophia', 'Thomas', 'avatar10.jpg', '10');

-- Populate "developer" table
INSERT INTO
  developer (id, user_id)
SELECT
  id,
  id
FROM
  user
WHERE
  id <= 5;

-- Populate "instructor" table
INSERT INTO
  instructor (id, user_id)
SELECT
  id,
  id
FROM
  user
WHERE
  id > 5;

-- Populate "post" table
INSERT INTO
  post (id, title, content, user_id)
VALUES
  (
    '1',
    'I need help with async/await',
    'I really don`t know if this is correct.',
    '1'
  ),
  (
    '2',
    'How do I implement a binary search algorithm?',
    'I`m trying to optimize my search function.',
    '2'
  ),
  (
    '3',
    'What are the best practices for handling exceptions in Java?',
    'I want to make my code more robust.',
    '3'
  ),
  (
    '4',
    'How can I improve the performance of my SQL queries?',
    'My application is running slow.',
    '4'
  ),
  (
    '5',
    'What are the differences between REST and SOAP?',
    'I`m not sure which one to use for my API.',
    '5'
  ),
  (
    '6',
    'How do I deploy a Django application to a production server?',
    'I`m having trouble with the deployment process.',
    '6'
  ),
  (
    '7',
    'What are the advantages of using React for front-end development?',
    'I`m considering using React for my next project.',
    '7'
  ),
  (
    '8',
    'How can I secure my web application against common vulnerabilities?',
    'I want to protect my application from attacks.',
    '8'
  ),
  (
    '9',
    'What are the best practices for version control with Git?',
    'I want to improve my collaboration workflow.',
    '9'
  ),
  (
    '10',
    'How do I optimize my website for search engines?',
    'I want to improve my website`s visibility.',
    '10'
  );

-- Populate "feedback" table
INSERT INTO
  feedback (
    id,
    content,
    rating,
    rates_count,
    user_id,
    post_id
  )
VALUES
  (
    '1',
    'Great job! This post provides a comprehensive explanation of how to use async/await in JavaScript. The examples are clear and easy to follow.',
    5,
    10,
    '1',
    '1'
  ),
  (
    '2',
    'Nice work! The post on implementing a binary search algorithm is well-written and includes step-by-step instructions. It helped me optimize my search function.',
    4,
    8,
    '2',
    '2'
  ),
  (
    '3',
    'Good effort! The post about handling exceptions in Java offers practical tips and best practices. It has improved the robustness of my code.',
    3,
    6,
    '3',
    '3'
  ),
  (
    '4',
    'Could be better. The post on improving SQL query performance could benefit from more examples and specific optimization techniques.',
    2,
    4,
    '4',
    '4'
  ),
  (
    '5',
    'Needs improvement. The post comparing REST and SOAP lacks depth and doesn`t provide enough information to make an informed decision.',
    1,
    2,
    '5',
    '5'
  ),
  (
    '6',
    'Excellent! The Django deployment guide is thorough and covers all the necessary steps. It helped me overcome my deployment challenges.',
    5,
    10,
    '6',
    '6'
  ),
  (
    '7',
    'Well done! The advantages of using React for front-end development are well-explained in the post. It convinced me to give React a try.',
    4,
    8,
    '7',
    '7'
  ),
  (
    '8',
    'Impressive! The post on securing web applications provides valuable insights into common vulnerabilities and effective mitigation strategies.',
    3,
    6,
    '8',
    '8'
  ),
  (
    '9',
    'Keep it up! The post about version control with Git offers practical tips for improving collaboration workflows. It has enhanced my development process.',
    2,
    4,
    '9',
    '9'
  ),
  (
    '10',
    'Good job! The post on optimizing websites for search engines provides actionable tips and techniques. It has helped me improve my website`s visibility.',
    1,
    2,
    '10',
    '10'
  );