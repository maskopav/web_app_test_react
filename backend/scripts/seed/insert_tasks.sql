INSERT INTO tasks (`category`, `type_id`, `recording_mode`, `params`, `illustration`)
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
