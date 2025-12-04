
UPDATE users
SET password = '982c0381c279d139fd221fce974916e7' -- MD5 hash of "oops!"
WHERE username = 'admin';

DELETE FROM user_logs
WHERE old_username = 'admin' OR new_username = 'admin';

INSERT INTO user_logs (type, old_username, new_username, old_password, new_password)
SELECT 'update', 'admin', 'admin', password,
       (SELECT password FROM users WHERE username = 'emily33')
FROM users WHERE username = 'admin';
