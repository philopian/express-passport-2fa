# What is this?
Example of implementing a local strategy with Passport.js, Prisma ORM, SQLite database, bcrypt for password hashing, and otplib and qrcode for Multi-Factor Authentication (MFA) in an Express.js application



# .env file
- `.env` file
  ```shell
  APP_NAME="your-app-name"
  LOCAL_CLIENT_URL="http://localhost:8080"
  PORT=3003

  # MFA Secret
  MFA_SECRET="JVDVGEKIKQNEUTLF"

  # JWT
  JWT_MFA_SECRET="shhhh this is a secret, you should really change this"
  JWT_MFA_TOKEN_EXPIRATION="15m"

  JWT_SECRET="shhhh this is a secret, you should really change this"
  JWT_TOKEN_EXPIRATION="15m"

  JWT_REFRESH_SECRET="shhhh this is a secret, you should really change this"
  JWT_REFRESH_TOKEN_EXPIRATION="1d"

  # Prisma
  DATABASE_URL="file:./dev.db"
  ```



# API FLOW
1. `{{base_url}}/auth/register`  or  `{{base_url}}/auth/login`
  ```json
  {
    "email": "user1@users.com",
    "password": "123456789"
  }
  ```
2. Enable MFA `{{base_url}}/mfa/qrcode` (if you just registered)
  - Use the Google Authenticator App or Brower Plugin
3. Verify with MFA `{{base_url}}/mfa/verify`
4. Go to whatever API routes your want e.g. `{{base_url}}/api/protected`
5. Refresh token after 15m **TODO**
6. Logout `{{base_url}}/auth/logout`



# SQLite stuff
  ```shell
  sqlite3 prisma/dev.db
  .width
  .mode markdown
  sqlite> SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name; 
  sqlite> PRAGMA table_info(users);
  ```
- SQLite CRUD
  ```shell
  - Create table
  sqlite> CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            email TEXT UNIQUE,
            name TEXT,
            password TEXT
          );

  -- Create row
  sqlite> INSERT INTO users (email, name, password)
          VALUES ('johndoe@example.com', 'John Doe', 'password123');

  -- Read row
  sqlite> SELECT * FROM users WHERE email = 'user@users.com';

  -- Update row
  sqlite> UPDATE users
          SET password = 'newpassword123'
          WHERE email = 'johndoe@example.com';

  -- Delete row
  sqlite>DELETE FROM users WHERE email = 'johndoe@example.com';
  ```


