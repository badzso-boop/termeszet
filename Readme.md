### Documentation

#### Registration Endpoint
- **URL:** `/api/register`
- **Method:** POST
- **Description:** Register a new user.
- **Input Parameters:**
  - `email` (required): User's email address.
  - `password` (required): User's password.
  - `name` (optional): User's name.
- **Output:**
  - `201 Created` - Successful registration.
    ```json
    {
      "message": "User registered successfully."
    }
    ```
  - `400 Bad Request` - Invalid or missing input data.
    ```json
    {
      "error": "Invalid input data."
    }
    ```

#### Login Endpoint
- **URL:** `/api/login`
- **Method:** POST
- **Description:** User login.
- **Input Parameters:**
  - `email` (required): User's email address.
  - `password` (required): User's password.
- **Output:**
  - `200 OK` - Successful login.
    ```json
    {
      "token": "JWT token",
      "message": "Login successful."
    }
    ```
  - `401 Unauthorized` - Invalid email or password.
    ```json
    {
      "error": "Invalid email or password."
    }
    ```

#### Admin Page

##### Admin Get Users Endpoint
- **URL:** `/api/admin/users`
- **Method:** GET
- **Description:** Retrieve all users.
- **Input Parameters:** None
- **Output:** JSON array of users.

##### Admin Update User Endpoint
- **URL:** `/api/admin/updateUser`
- **Method:** PUT
- **Description:** Update user details.
- **Input Parameters:**
  - `id` (required): User's unique identifier.
  - `email` (optional): User's email address.
  - `password` (optional): User's password.
  - `name` (optional): User's name.
- **Output:**
  - `200 OK` - Successful update.
    ```json
    {
      "message": "Update successful."
    }
    ```
  - `401 Unauthorized` - Invalid data.
    ```json
    {
      "error": "Invalid data."
    }
    ```

##### Admin Delete User Endpoint
- **URL:** `/api/admin/deleteUser`
- **Method:** DELETE
- **Description:** Delete a user.
- **Input Parameters:**
  - `id` (required): User's unique identifier.
- **Output:**
  - `200 OK` - Successful deletion.
    ```json
    {
      "message": "Delete successful."
    }
    ```
  - `401 Unauthorized` - Something went wrong.
    ```json
    {
      "error": "Something went wrong."
    }
    ```

##### Admin Create User Endpoint
- **URL:** `/api/admin/createUser`
- **Method:** POST
- **Description:** Create a new user.
- **Input Parameters:**
  - `email` (required): User's email address.
  - `password` (required): User's password.
  - `name` (optional): User's name.
- **Output:**
  - `200 OK` - Successful creation.
    ```json
    {
      "message": "User creation successful."
    }
    ```
  - `401 Unauthorized` - Something went wrong.
    ```json
    {
      "error": "Something went wrong."
    }
    ```

##### Admin Create User Homework Endpoint
- **URL:** `/api/admin/createUserHW`
- **Method:** POST
- **Description:** Create user homework.
- **Input Parameters:**
  - `cim` (required): Homework title.
  - `felhasznalo id` (required): User's ID.
  - `leiras` (optional): Homework description.
  - `hatarido datum` (required): Deadline date.
  - `letrehozas datuma` (optional): Creation date.
  - `megoldas` (optional): Solution.
  - `kesz` (required): false
- **Output:**
  - `200 OK` - Successful creation.
    ```json
    {
      "message": "User homework creation successful."
    }
    ```
  - `401 Unauthorized` - Something went wrong.
    ```json
    {
      "error": "Something went wrong."
    }
    ```

##### Admin Update User Homework Endpoint
- **URL:** `/api/admin/updateUserHW`
- **Method:** PUT
- **Description:** Update user homework.
- **Input Parameters:**
  - `id` (required)
  - `cim` (optional): Homework title.
  - `felhasznalo id` (optional): User's ID.
  - `leiras` (optional): Homework description.
  - `hatarido datum` (optional): Deadline date.
  - `letrehozas datuma` (optional): Creation date.
  - `megoldas` (optional): Solution.
  - `kesz` (optional): false
- **Output:**
  - `200 OK` - Successful update.
    ```json
    {
      "message": "User homework update successful."
    }
    ```
  - `401 Unauthorized` - Something went wrong.
    ```json
    {
      "error": "Something went wrong."
    }
    ```

##### Admin Delete User Homework Endpoint
- **URL:** `/api/admin/deleteUserHW`
- **Method:** DELETE
- **Description:** Delete user homework.
- **Input Parameters:**
  - `id` (required)
- **Output:**
  - `200 OK` - Successful deletion.
    ```json
    {
      "message": "User homework delete successful."
    }
    ```
  - `401 Unauthorized` - Something went wrong.
    ```json
    {
      "error": "Something went wrong."
    }
    ```

#### Users Page

##### Get User Endpoint
- **URL:** `/api/user`
- **Method:** POST
- **Description:** Get user details.
- **Input Parameters:**
  - `id` (required): User's unique identifier.
- **Output:** JSON of the user.

#### Minikurzus

##### Get all Minikurzus Endpoint
- **URL:** `/api/minikurzusok`
- **Method:** GET
- **Description:** Retrieve all minikurzus.
- **Input Parameters:** None
- **Output:** JSON array of minikurzus.

##### Admin Create Minikurzus Endpoint
- **URL:** `/api/admin/createKurzus`
- **Method:** POST
- **Description:** Create a new minikurzus.
- **Input Parameters:**
  - `cím` (required): Course title.
  - `helyszín` (required): Location of the minikurzus.
  - `időpont` (required): Date and time of the minikurzus.
  - `ár` (required): Cost of the course.
  - `témakör` (required): Topic of the course.
  - `leírás` (optional): Detailed description of the course.
  - `fájlok` (optional): Files.
  - `felhasználók` (optional): Users who can access (if empty, accessible to all).
  - `megkötések` (optional): Prerequisites.
- **Output:**
  - `200 OK` - Successful creation.
    ```json
    {
      "message": "Course creation successful."
    }
    ```
  - `401 Unauthorized` - Something went wrong.
    ```json
    {
      "error": "Something went wrong."
    }
    ```

##### Admin Update Minikurzus Endpoint
- **URL:** `/api/admin/updateKurzus`
- **Method:** PUT
- **Description:** Update a minikurzus.
- **Input Parameters:**
  - `id` (required)
  - `cím` (optional): Course title.
  - `helyszín` (optional): Location of the minikurzus.
  - `időpont` (optional): Date and time of the minikurzus.
  - `ár` (optional): Cost of the course.
  - `témakör` (optional): Topic of the course.
  - `leírás` (optional): Detailed description of the course.
  - `fájlok` (optional): Files.
  - `felhasználók` (optional): Users who can access (if empty, accessible to all).
  - `megkötések` (optional): Prerequisites.
- **Output:**
  - `200 OK` - Successful update.
    ```json
    {
      "message": "Course update successful."
    }
    ```
  - `401 Unauthorized` - Something went wrong.
    ```json
    {
      "error": "Something went wrong."
    }
    ```

##### Admin Delete Minikurzus Endpoint
- **URL:** `/api/admin/deleteKurzus`
- **Method:** DELETE
- **Description:** Delete a minikurzus.
- **Input Parameters:**
  - `id` (required)
- **Output:**
  - `200 OK` - Successful deletion.
    ```json
    {
      "message": "Course delete successful."
    }
    ```
  - `401 Unauthorized` - Something went wrong.
    ```json
    {
      "error": "Something went wrong."
    }
    ```

### Database Plan

#### Users Table
- `id`
- `full_name`
- `username`
- `email`
- `pwd`
- `rang`
- `description`
- `born_date`
- `allergies`
- `mutetek`
- `amalgan_fogtomes`
- `drugs`
- `complaints`
- `goal`
- `courses`

#### Minikurzus Table
- `cim`
- `helyszin`
- `idopont`
- `ar`
- `temakor`
- `leiras`
- `fajlok`
- `felhasznalok`
- `megkotesek`

#### Homework Table
- `cim`
- `userid`
- `leiras`
- `hatarido_datum`
- `letrehozas_datuma`
- `megoldas`
- `ready`