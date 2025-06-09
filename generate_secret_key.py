import secrets

# Read PostgreSQL credentials from a file
with open('db_credentials.txt', 'r') as file:
    lines = file.readlines()
    username = lines[0].strip()  # Assuming the first line is the username
    password = lines[1].strip()  # Assuming the second line is the password

# Generate a secure SECRET_KEY
SECRET_KEY = secrets.token_urlsafe(32)
print(SECRET_KEY)
print(f"PostgreSQL Username: {username}")
print(f"PostgreSQL Password: {password}") 