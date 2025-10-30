-- scripts/initTasks.sql
-- roles

-- users
INSERT INTO users (`email`,`email`,`email`,`email`,`email`,) VALUES
('voice'),
('camera'),
('motoric');


-- task types
INSERT INTO task_types (`type`) VALUES
('voice'),
('camera'),
('motoric');

-- task types
INSERT INTO languages (`code`,`name`) VALUES
('en', 'english'),
('cs', 'czech'),
('de', 'german'),
('fr', 'french'),
('it', 'italian'),
('es', 'spanish');

-- tasks (only param names)
INSERT INTO tasks (`key`, `type_id`, `recording_mode`, `params`, `illustration`)
VALUES
('phonation', 
 (SELECT id FROM task_types WHERE type='voice'),
 JSON_OBJECT('mode', 'delayedStop', 'duration', 5),
 JSON_ARRAY('phoneme', 'repeat', 'duration'),
 NULL
),
('syllableRepeating', 
 (SELECT id FROM task_types WHERE type='voice'),
 JSON_OBJECT('mode', 'countDown', 'duration', 5),
 JSON_ARRAY('syllable', 'repeat', 'duration'),
 NULL
),
('retelling',
 (SELECT id FROM task_types WHERE type='voice'),
 JSON_OBJECT('mode', 'basicStop'),
 JSON_ARRAY('fairytale', 'repeat'),
 NULL
),
('reading',
 (SELECT id FROM task_types WHERE type='voice'),
 JSON_OBJECT('mode', 'basicStop'),
 JSON_ARRAY('topic', 'repeat'),
 NULL
),
('monologue',
 (SELECT id FROM task_types WHERE type='voice'),
 JSON_OBJECT('mode', 'delayedStop', 'duration', 10),
 JSON_ARRAY('topic', 'repeat', 'duration'),
 NULL
);


-- FOR TRUNCATING TABLES, USE: DELETE FROM task_types; -> ALTER TABLE task_types AUTO_INCREMENT = 1;