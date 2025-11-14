-- ============================================
-- ARTIFICIAL TEST DATA FOR TASKPROTOCOLLER DB
-- Compatible with your schema
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------
-- 1) Projects
-- --------------------------
TRUNCATE TABLE projects;

INSERT INTO projects (id, name, description, start_date, end_date, is_active, frequency, country, contact_person)
VALUES
(1, 'Swiss_1', 'Speech monitoring pilot in Switzerland', '2024-01-01', NULL, 1, 'weekly', 'Switzerland', 'Dr. Müller'),
(2, 'German_Study', 'German phonation analysis study', '2024-03-15', NULL, 1, 'daily', 'Germany', 'Dr. Schmidt'),
(3, 'Czech_Clinic', 'Clinical voice analysis', '2023-11-01', NULL, 1, 'weekly', 'Czech Republic', 'MUDr. Novák'),
(4, 'Slovak_Test', 'Short-term feasibility test', '2025-01-12', '2025-06-30', 0, 'weekly', 'Slovakia', 'Dr. Horváth'),
(5, 'France_Pilot', 'French language reading tasks', '2024-08-20', NULL, 1, 'monthly', 'France', 'Dr. Dupont'),
(6, 'UK_Dysphonia', 'Dysphonia longitudinal study', '2023-05-14', NULL, 1, 'daily', 'United Kingdom', 'Dr. Adams');

-- --------------------------
-- 2) Participants
-- --------------------------

TRUNCATE TABLE participants;

INSERT INTO participants (id, external_id, full_name, birth_date, sex, contact_email, contact_phone, notes)
VALUES
(1, NULL, 'Anna Becker', '1990-02-15', 'female', 'anna.becker@example.com', '+41790000001', NULL),
(2, NULL, 'Markus Steiner', '1985-07-11', 'male', 'markus.steiner@example.com', '+41790000002', NULL),
(3, NULL, 'Lucie Dvořáková', '1992-03-21', 'female', 'lucie.dvorakova@example.com', '+420700111222', NULL),
(4, NULL, 'Tomáš Konečný', '1988-10-03', 'male', 'tomas.konecny@example.com', '+420700111223', NULL),
(5, NULL, 'Lisa Weber', '1995-06-19', 'female', 'lisa.weber@example.com', '+491720002233', NULL),

(6, NULL, 'John Smith', '1978-01-02', 'male', 'john.smith@example.com', '+447700900111', NULL),
(7, NULL, 'Emily Clark', '1989-12-08', 'female', 'emily.clark@example.com', '+447700900112', NULL),
(8, NULL, 'Pierre Martin', '1984-04-15', 'male', 'pierre.martin@example.com', '+336700223344', NULL),
(9, NULL, 'Claire Bernard', '1991-09-07', 'female', 'claire.bernard@example.com', '+336700223355', NULL),
(10, NULL, 'Ján Novotný', '1975-05-27', 'male', 'jan.novotny@example.com', '+421900223311', NULL);

-- Add more generic artificial participants
INSERT INTO participants (external_id, full_name, birth_date, sex)
SELECT
  CONCAT('EXT', LPAD(n, 3, '0')),
  CONCAT('Test User ', n),
  DATE('1970-01-01') + INTERVAL (RAND()*15000) DAY,
  ELT(FLOOR(RAND()*2)+1, 'male', 'female')
FROM (
  SELECT 11 as n UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION
  SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20 UNION
  SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION
  SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30 UNION
  SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35
) AS x;

-- --------------------------
-- 3) Project–Protocol mapping
-- --------------------------
-- Requires existing protocol records!
-- If you want artificial protocols generated too → tell me.

TRUNCATE TABLE project_protocols;

-- Example: project 1 uses protocols 1,2
INSERT INTO project_protocols (id, project_id, protocol_id)
VALUES
(1, 1, 3),
(2, 1, 7),
(3, 2, 8),
(4, 2, 9),
(5, 3, 10),
(6, 3, 12),
(7, 4, 21),
(8, 5, 24),
(9, 6, 26);

-- --------------------------
-- 4) Participant-Protocol assignment
-- --------------------------

TRUNCATE TABLE participant_protocols;

INSERT INTO participant_protocols
(participant_id, project_protocol_id, unique_token, start_date, end_date, is_active)
VALUES
-- project 1
(1, 1, UUID(), '2024-02-01', NULL, 1),
(2, 2, UUID(), '2024-02-12', NULL, 1),

-- project 2
(6, 3, UUID(), '2024-03-20', NULL, 1),
(7, 4, UUID(), '2024-03-22', NULL, 1),

-- project 3
(3, 5, UUID(), '2023-12-01', NULL, 1),
(4, 6, UUID(), '2024-01-10', '2024-03-01', 0),

-- project 4 (inactive)
(10, 7, UUID(), '2025-01-12', '2025-02-10', 0),

-- etc.
(8, 8, UUID(), '2024-09-02', NULL, 1),
(9, 9, UUID(), '2024-10-14', NULL, 1);

-- Random assignment of the remaining participants
INSERT INTO participant_protocols (participant_id, project_protocol_id, unique_token, start_date, is_active)
SELECT 
  p.id,
  FLOOR(1 + RAND()*9), 
  UUID(),
  DATE('2024-01-01') + INTERVAL (RAND()*200) DAY,
  1
FROM participants p
WHERE p.id > 10;


UPDATE project_protocols
SET access_token = LPAD(HEX(RANDOM_BYTES(32)), 64, '0')
WHERE access_token IS NULL;

SET FOREIGN_KEY_CHECKS = 1;
