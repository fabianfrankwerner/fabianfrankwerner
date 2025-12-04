from cs50 import SQL

# Connect to the SQLite database
db = SQL("sqlite:///dont-panic.db")

# Update the administrator's password
db.execute(
    """
    UPDATE "users"
    SET "password" = 'CS50'
    WHERE "username" = 'admin';
    """
)

print("Hacked")
