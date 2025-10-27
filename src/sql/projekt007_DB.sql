CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255),
  `role_id` integer NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `roles` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE NOT NULL COMMENT 'master, admin',
  `description` text
);

CREATE TABLE `user_projects` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `project_id` integer NOT NULL,
  `assigned_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `projects` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE NOT NULL,
  `description` text,
  `start_date` date NOT NULL,
  `end_date` date,
  `is_active` boolean NOT NULL DEFAULT true,
  `frequency` varchar(255) COMMENT 'e.g. daily, weekly, monthly',
  `country` varchar(255),
  `contact_person` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` integer,
  `updated_at` timestamp,
  `updated_by` integer
);

CREATE TABLE `project_subjects` (
  `project_id` integer NOT NULL,
  `subject_id` integer NOT NULL,
  `enrolled_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `added_by` integer,
  PRIMARY KEY (`project_id`, `subject_id`)
);

CREATE TABLE `protocols` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `language_id` integer NOT NULL,
  `description` text,
  `version` integer NOT NULL DEFAULT 1,
  `questionnaires_id` integer,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` integer,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_by` integer
);

CREATE TABLE `questionnaires` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `questions` JSON NOT NULL,
  `version` integer DEFAULT 1,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `project_protocols` (
  `project_id` integer NOT NULL,
  `protocol_id` integer NOT NULL,
  PRIMARY KEY (project_id,protocol_id)
);

CREATE TABLE `protocol_tasks` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `protocol_id` integer NOT NULL,
  `task_id` integer NOT NULL,
  `task_order` integer NOT NULL,
  `params` JSON COMMENT 'Admin-defined overrides for duration, topic, phoneme, etc. vs each param as new column??'
);

CREATE TABLE `tasks` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `key` varchar(255) UNIQUE NOT NULL COMMENT 'e.g. monologue, reading, phonation',
  `type_id` integer NOT NULL COMMENT 'id of voice, visual, cognitive',
  `recording_mode` JSON NOT NULL,
  `params` JSON COMMENT 'JSON schema of editable parameters - names not values',
  `illustration` text,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `task_types` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `type` varchar(255) UNIQUE COMMENT 'voice, visual, cognitive',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `languages` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `code` varchar(255) UNIQUE NOT NULL COMMENT 'e.g. en, cs, de',
  `name` varchar(255) NOT NULL
);

CREATE TABLE `subjects` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `external_id` varchar(255) UNIQUE COMMENT 'Optional external ID if linked to hospital or registry',
  `full_name` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `sex` varchar(10),
  `contact_email` varchar(255),
  `contact_phone` varchar(255),
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp
);

CREATE TABLE `participant_protocols` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `project_id` integer NOT NULL,
  `subject_id` integer NOT NULL,
  `protocol_id` integer NOT NULL,
  `unique_token` varchar(255) UNIQUE NOT NULL COMMENT 'UUID or hash to reconstruct the URL on the backend',
  `start_date` date NOT NULL,
  `end_date` date,
  `is_active` BOOLEAN DEFAULT TRUE
);

CREATE TABLE `sessions` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `participant_protocol_id` integer NOT NULL,
  `session_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `progress` JSON COMMENT 'Stores completed task IDs and timestamps',
  `completed` boolean DEFAULT false,
  `environment_notes` text
);

CREATE TABLE `recordings` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `session_id` integer NOT NULL,
  `protocol_task_id` integer NOT NULL,
  `repeat_index` integer NOT NULL DEFAULT 1 COMMENT '1..n repetition count per session/task',
  `recording_url` varchar(255) NOT NULL,
  `duration_seconds` integer,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX `user_projects_index_0` ON `user_projects` (`user_id`, `project_id`);

CREATE UNIQUE INDEX `protocols_index_1` ON `protocols` (`name`, `version`);

CREATE UNIQUE INDEX `protocol_tasks_index_2` ON `protocol_tasks` (`protocol_id`, `task_order`);

CREATE UNIQUE INDEX `participant_protocols_index_3` ON `participant_protocols` (`project_id`, `subject_id`, `protocol_id`);

CREATE UNIQUE INDEX `recordings_index_4` ON `recordings` (`session_id`, `protocol_task_id`, `repeat_index`);

ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `user_projects` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_projects` ADD FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

ALTER TABLE `projects` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `projects` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `project_subjects` ADD FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

ALTER TABLE `project_subjects` ADD FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

ALTER TABLE `project_subjects` ADD FOREIGN KEY (`added_by`) REFERENCES `users` (`id`);

ALTER TABLE `protocols` ADD FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`);

ALTER TABLE `protocols` ADD FOREIGN KEY (`questionnaires_id`) REFERENCES `questionnaires` (`id`);

ALTER TABLE `protocols` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `protocols` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `project_protocols` ADD FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

ALTER TABLE `project_protocols` ADD FOREIGN KEY (`protocol_id`) REFERENCES `protocols` (`id`);

ALTER TABLE `protocol_tasks` ADD FOREIGN KEY (`protocol_id`) REFERENCES `protocols` (`id`);

ALTER TABLE `protocol_tasks` ADD FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`);

ALTER TABLE `tasks` ADD FOREIGN KEY (`type_id`) REFERENCES `task_types` (`id`);

ALTER TABLE `participant_protocols` ADD FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`);

ALTER TABLE `participant_protocols` ADD FOREIGN KEY (`project_id`, `subject_id`) REFERENCES `project_subjects` (`project_id`, `subject_id`);

ALTER TABLE `participant_protocols` ADD FOREIGN KEY (`project_id`, `protocol_id`) REFERENCES `project_protocols` (`project_id`, `protocol_id`);

ALTER TABLE `sessions` ADD FOREIGN KEY (`participant_protocol_id`) REFERENCES `participant_protocols` (`id`);

ALTER TABLE `recordings` ADD FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`);

ALTER TABLE `recordings` ADD FOREIGN KEY (`protocol_task_id`) REFERENCES `protocol_tasks` (`id`);
