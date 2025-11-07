INSERT INTO roles (`name`, `description`) VALUES
('master', 'Full system control — can create, update, and delete all tables, manage projects, admins, and global settings. Only a few users should have this role.'),
('admin', 'Limited project-based control — can manage only assigned projects, their participants, and related data. Cannot see or modify other projects.');
