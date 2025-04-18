-- Index for finding a student's historical course enrollments
-- This helps with the JOIN between enrollments and students tables
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);

-- Index for finding enrollments by course
-- This helps with the JOIN between enrollments and courses tables
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

-- Composite index for efficiently searching courses by department and semester
-- This helps queries that filter by both department and semester
CREATE INDEX idx_courses_dept_semester ON courses(department, semester);

-- Index for searching courses by title
-- This helps with queries that search by title using LIKE
CREATE INDEX idx_courses_title ON courses(title);

-- Index for finding courses by semester
-- This helps with queries that filter only by semester
CREATE INDEX idx_courses_semester ON courses(semester);

-- Index for looking up satisfies records by course_id
-- This helps with subqueries that look up requirements satisfied by courses
CREATE INDEX idx_satisfies_course_id ON satisfies(course_id);

-- Index for the requirement_id in satisfies table
-- This helps with JOINs between requirements and satisfies tables
CREATE INDEX idx_satisfies_requirement_id ON satisfies(requirement_id);
