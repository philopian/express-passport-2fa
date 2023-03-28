# What is this?
Example of implementing a local strategy with Passport.js, Prisma ORM, SQLite database, bcrypt for password hashing, and otplib and qrcode for two-factor authentication (2FA) in an Express.js application


# This app
- 
- Get started
  ```shell
  $ yarn add express passport passport-jwt jsonwebtoken bcryptjs prisma @prisma/client dotenv body-parser cors
  $ npx prisma init 
  $ npx prisma db push
  ```



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





# .env file
- `.env` file
  ```shell
  APP_NAME="expressjs-jwt-example"
  LOCAL_CLIENT_URL="http:localhost:8080"
  PORT=3003

  # JWT
  JWT_SECRET="this is a secret shhhhh"
  JWT_REFRESH_SECRET="this is a secret shhhhh"

  # Prisma
  DATABASE_URL="file:./dev.db"
  ```

