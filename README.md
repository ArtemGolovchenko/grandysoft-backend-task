# grandysoft-backend-task
## Installation
1. Clone a repository
2. Install all the dependencies:
    ```sh
    npm install
    ```
3. create an empty database:
   ```sh
      HOST: "localhost",
      PORT: 5432
      USER: "postgres",
      PASSWORD: "postgres",
      DB: "testdb"
    ```
4. run a migration to create tables:
   ```sh
    npx sequelize-cli db:migrate
   ```
5. generate random users by using the seeding script:
   ```sh
    npx sequelize-cli db:seed:all
    ```
6. run the application:
   ```sh
    node server.js
    ```
## Endpoints
| Endpoint | Function |
| ------ | ------ |
| GET http://localhost:8080/users  | Get all users with subscriptions
| GET http://localhost:8080/users/{userId}/friends?order_by=id&order_type=desc  | Get user with friends sorted by id
| GET http://localhost:8080/users/max-following  | Get top 5 users with max subscriptions count
| GET http://localhost:8080/users/no-following  | Get users with no subscriptions
| POST http://localhost:8080/users/{userId}/subscribe/{friendId}  | Subscribe to user
| DELETE http://localhost:8080/users/{userId}/unsubscribe/{friendId}  | Unsubscribe from user

