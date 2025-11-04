1. See All Employees

SELECT * FROM employee_dashboard_employeeprofile LIMIT 20;

2. See All Employers

SELECT * FROM employer_dashboard_employerprofile LIMIT 20;

3. See All Users (to check their type)

SELECT * FROM employer_dashboard_employerprofile LIMIT 20;

4. If you want to see only recently registered users

SELECT * FROM auth_user ORDER BY date_joined DESC LIMIT 20;

5. If you want to see login activity
Check for a table like authentication_useractivity or authentication_usersession:

SELECT * FROM authentication_useractivity ORDER BY last_login DESC LIMIT 20;

OR 

SELECT * FROM authentication_usersession ORDER BY login_time DESC LIMIT 20;


## Get Employee Registered Gmail Addresses:
SELECT u.email
FROM auth_user u
JOIN employee_dashboard_employeeprofile e ON u.id = e.user_id;

## Get Employer Registered Gmail Addresses
SELECT u.email
FROM auth_user u
JOIN employer_dashboard_employerprofile e ON u.id = e.user_id;

If you want to delete an employee or employer and all related profile data:

Delete the profile first (to avoid foreign key errors), then delete the user:
For Employee:

DELETE FROM employee_dashboard_employeeprofile WHERE user_id = (SELECT id FROM auth_user WHERE email = '<user_email>');
DELETE FROM auth_user WHERE email = '<user_email>';

For Employer:
DELETE FROM employer_dashboard_employerprofile WHERE user_id = (SELECT id FROM auth_user WHERE email = '<user_email>');
DELETE FROM auth_user WHERE email = '<user_email>';