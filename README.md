# Rapptr Todo task

## ENV
To setup the project, you need some required envs else starting up the service would fail. You can also check the [`.env.example`](.env.example) file

### Required
```sh
MONGODB_URL= #MongoDB connection url
JWT_SECRET= #JWT encoding secret key
```
### Not required
```sh
PORT= #Application server port defaults to 4000
JWT_ACCESS_EXPIRATION_MINUTES= #Defaults to 5
NODE_ENV='production'|'development'|'test' #Defaults to development 
```

## Setup
Clone this repository on your PC and move into project directory
#### Cloning this repo
```sh
$~ git clone <this-repository-link>
   ...
   done

$~ cd <project-root-dir>
```

#### Run Yarn
```sh
yarn
yarn test
...
yarn build
yarn start
# or
yarn start:build # should run both
```
Be sure MongoDB is running locally.

## Entities
There are two entities created for this task
 - Todo
 - User
### User data
 - `username:` The username name is a unique name field for created users.
 - `id:` The id is a unique mongoId transformed field for created users.
### Todo
 - `title:` The title is a non unique string field for a todo item.
 - `isCompleted:` The isCompleted is boolean field indicating if the todo is completed or not
 - `creator:` The creator is mongoId string referencing the user id
 - `isDeleted:` The isDeleted is a boolean field indicating if the todo is deleted or not. soft-delete is implemented 
 - `id:` The id is a unique mongoId transformed field for created todo.

## Folders

<details> 
  <summary>src</summary>

    controllers/
    services/
    models/
    interfaces/
    middlewares/
    routes/
    validations/
    utils/
    config/
    app.ts
</details>
<details> 
  <summary>test</summary>
</details>


## APIs

#### Request Headers
key: `x-auth-token` \
value: `token`

<details> 
  <summary>POST create To-do (requires token)</summary>

  `POST: ` http://localhost:4000/api/v1/todos

  Payload

  ```json
  {
    "title":"Todo tilte"
  }
  ```

</details>
<details> 
  <summary>PATCH update To-do (requires token)</summary>

  `PATCH: ` http://localhost:4000/api/v1/todos/{todoId}

  Payload

  ```json
  {
    "title":"Todo tilte",
    "isCompleted": true
  }
  ```

</details>
<details> 
  <summary>DELETE delete To-do (requires token)</summary>

  `DELETE: ` http://localhost:4000/api/v1/todos/{todoId}

</details>
<details> 
  <summary>GET return a To-do</summary>

  `GET: ` http://localhost:4000/api/v1/todos/{todoId}

</details>
<details> 
  <summary>GET return all To-do</summary>

  `GET: ` http://localhost:4000/api/v1/todos

</details>
<details> 
  <summary>POST Create user</summary>

  `POST: ` http://localhost:4000/api/v1/auth/register

  Payload

  ```json
  {
    "username": "rapptr_user"
  }
  ```

</details>
<details> 
  <summary>POST Login user</summary>

  `POST: ` http://localhost:4000/api/v1/auth/login

  Payload

  ```json
  {
    "username": "rapptr_user"
  }
  ```

</details>

