CREATE TABLE tasks (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status ENUM('pending', 'in-progress', 'done') NOT NULL DEFAULT 'pending',
  deadline DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  KEY idx_tasks_user_status (user_id, status),
  KEY idx_tasks_user_deadline (user_id, deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
