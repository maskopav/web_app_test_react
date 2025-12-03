CREATE OR REPLACE VIEW v_participant_protocols AS
SELECT
    pp.id                            AS participant_protocol_id,
    pp.access_token,
    pp.start_date,
    pp.end_date,
    pp.is_active,

    -- participant
    p.id                             AS participant_id,
    p.external_id,
    p.full_name,
    p.birth_date,
    p.sex,
    p.contact_email,
    p.contact_phone,
    p.notes,

    -- project
    pr.id                            AS project_id,
    pr.name                          AS project_name,
    pr.frequency                     AS project_frequency,

    -- project_protocols
    ppr.id                           AS project_protocol_id,

    -- protocol
    proto.id                         AS protocol_id,
    proto.name                       AS protocol_name,
    proto.version                    AS protocol_version,
    proto.is_current                 AS is_current_protocol,

    -- Aggregated Counts
    COALESCE(agg.n_tasks, 0)         AS n_tasks,
    COALESCE(agg.n_quest, 0)         AS n_quest

FROM participant_protocols pp
JOIN participants p
    ON p.id = pp.participant_id

JOIN project_protocols ppr
    ON ppr.id = pp.project_protocol_id

JOIN projects pr
    ON pr.id = ppr.project_id

JOIN protocols proto
    ON proto.id = ppr.protocol_id

LEFT JOIN (
    SELECT 
        pt.protocol_id, 
        SUM(IF(t.category != 'questionnaire', 1, 0)) AS n_tasks,
        SUM(IF(t.category = 'questionnaire', 1, 0)) AS n_quest
    FROM protocol_tasks pt 
    JOIN tasks t ON pt.task_id = t.id 
    GROUP BY pt.protocol_id
) agg ON agg.protocol_id = proto.id;


CREATE OR REPLACE VIEW v_project_protocols AS
SELECT 
    p.id,
    p.protocol_group_id,
    p.name,
    p.language_id,
    p.description,
    p.version,
    p.is_current,
    p.created_at,
    p.created_by,
    p.updated_at,
    p.updated_by,
    -- Join Data
    pp.project_id,
    pr.name AS project_name,
    pr.end_date AS project_end_date,
    -- Aggregated Counts (Default to 0 if NULL)
    COALESCE(agg.n_tasks, 0) AS n_tasks,
    COALESCE(agg.n_quest, 0) AS n_quest
FROM protocols p
JOIN project_protocols pp ON p.id = pp.protocol_id
JOIN projects pr ON pp.project_id = pr.id
-- Efficient Aggregation Join
LEFT JOIN (
    SELECT 
        pt.protocol_id, 
        SUM(IF(t.category != 'questionnaire', 1, 0)) AS n_tasks,
        SUM(IF(t.category = 'questionnaire', 1, 0)) AS n_quest
    FROM protocol_tasks pt 
    JOIN tasks t ON pt.task_id = t.id 
    GROUP BY pt.protocol_id
) agg ON agg.protocol_id = p.id;