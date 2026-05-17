CREATE TABLE IF NOT EXISTS links (
  id INT NOT NULL AUTO_INCREMENT,
  link_name VARCHAR(255) NOT NULL,
  link TEXT NOT NULL,
  status ENUM('active', 'inactive', 'disabled') NOT NULL DEFAULT 'active',
  remark TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tags (
  id INT NOT NULL AUTO_INCREMENT,
  tag_name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#3b82f6',
  status ENUM('active', 'inactive', 'disabled') NOT NULL DEFAULT 'active',
  remark TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tags_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS link_tags (
  id INT NOT NULL AUTO_INCREMENT,
  link_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_link_tags_link_id_tag_id (link_id, tag_id),
  KEY idx_link_tags_link_id (link_id),
  KEY idx_link_tags_tag_id (tag_id),
  CONSTRAINT fk_link_tags_link_id
    FOREIGN KEY (link_id) REFERENCES links (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_link_tags_tag_id
    FOREIGN KEY (tag_id) REFERENCES tags (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
