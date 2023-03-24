# This app
- Get started
  ```shell
  $ yarn add express passport passport-jwt jsonwebtoken bcryptjs prisma @prisma/client dotenv body-parser cors
  $ npx prisma init 
  $ npx prisma db push
  ```


- SQlLite stuff
  ```shell
  sqlite3 prisma/dev.db
  SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name; 
  PRAGMA table_info(users);
  ```

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

