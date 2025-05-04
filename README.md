# About

WhatsApp Clone

## Documentation

- ### Backend
  
  - **Deps**:
    - [Express](https://expressjs.com/) - Web framework for Node.js
    - [Socket.io](https://socket.io/) - Real-time communication library
    - [Mongoose](https://mongoosejs.com/) - MongoDB object modeling tool
    - [Cors] - Cross-Origin Resource Sharing middleware for Express
    - [Dotenv] - Loads environment variables from a `.env` file into `process.env`
    - [Bcrypt] - Password hashing library
    - [Jsonwebtoken] - JSON Web Token implementation for authentication
    - [Cookie-parser] - Middleware for parsing cookies

  - **API Endpoints**:
    - **Auth**:
      - `Register a new user`:
        - *Method*: `POST`
        - *Endpoint*: `/api/auth/signup`
        - *Request Body*:

          ```json
          {
            "fullname": {
                "firstname": String,
                "lastname": String
            },
            "phonenumber": String,
            "email": String,
            "password": String
          }
          ```

        - *Response*:

          ```json
          {
            "status": String,
            "data": {
                "user": {
                    "fullname": {
                        "firstname": String,
                        "lastname": String
                    },
                    "_id": ObjectId,
                    "phonenumber": String,
                    "email": String,
                    "status": Enum[String],
                    "createdAt": Date,
                    "updatedAt": Date,
                    "__v": 0
                },
                "token":String
            },
            "message": String
          }
          ```

      - `Logging in user`:
        - *Method*: `POST`
        - *Endpoint*: `/api/auth/login`
        - *Request Body*:

          ```json
          {
            "email": String,
            "password": String
          }
          ```

        - *Response*:

          ```json
          {
            "status": String,
            "data": {
                "user": {
                    "fullname": {
                        "firstname": String,
                        "lastname": String
                    },
                    "_id": ObjectId,
                    "phonenumber": String,
                    "email": String,
                    "status": Enum[String],
                    "createdAt": Date,
                    "updatedAt": Date,
                    "__v": 0
                },
                "token":String
            },
            "message": String
          }
          ```

      - `Logging out user`:
        - *Method*: `GET`
        - *Endpoint*: `/api/auth/logout`
        - *Response*:

          ```json
          {
            "status": String,
            "message": String
          }
          ```

    - **Users**:
      - `Get logged in user profile`:
        - *Method*: `GET`
        - *Endpoint*: `/api/user`
        - *Response*:

          ```json
          {
            "users": [
              {
                "_id": String,
                "fullname": {
                  "firstname": String,
                  "lastname": String
                },
                "phonenumber": String,
                "email": String,
                "password": String
              }
            ]
          }
          ```

      - `Get user by ID`:
        - *Method*: `GET`
        - *Endpoint*: `/api/user/email`
        - *Response*:

          ```json
          {
            "_id": String,
            "fullname": {
              "firstname": String,
              "lastname": String
            },
            "phonenumber": String,
            "email": String,
            "password": String
          }
          ```

    - **Message**
      - `Send a message`:
        - *Method*: `POST`
        - *Endpoint*: `/api/message/send/:id`
        - *Param*: `id` - ID of the user to send the message to
        - *Cookie*: `token` - JWT token for authentication which will also be used to identify the user sending the message
        - *Request Body*:

          ```json
          {
            "message": String,
          }
          ```

        - *Response*:

          ```json
          {
            "status": String,
            "data": {
                "senderid": ObjectId,
                "receiverid": ObjectId,
                "content": String,
                "isDeleted": Enum[String],
                "messageType": Enum[String],
                "messageStatus": Enum[String],
                "_id": ObjectId,
                "createdAt": Date,
                "updatedAt": Date,
                "__v": Number,
            },
            "message": String
          }
          ```

      - `Get message from a user`:
        - *Method*: `GET`
        - *Endpoint*: `/api/message/get/:id`
        - *Param*: `id` - ID of the user to get messages from
        - *Cookie*: `token` - JWT token for authentication which will also be used to identify the user sending the message
        - *Response*:

          ```json
          {
            "status": String,
            "data": [
                {
                    "senderid": ObjectId,
                    "receiverid": ObjectId,
                    "content": String,
                    "isDeleted": Enum[String],
                    "messageType": Enum[String],
                    "messageStatus": Enum[String],
                    "_id": ObjectId,
                    "createdAt": Date,
                    "updatedAt": Date,
                    "__v": Number,
                }
            ],
            "message": String
          }
          ```
