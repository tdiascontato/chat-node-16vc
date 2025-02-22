# Chat Application API Documentation

This document provides the API specification for a real-time chat application. The application allows users to register, login, create and manage conversations, and send messages. WebSocket is used to handle real-time messaging.

---

## Table of Contents

1. [Authentication](#authentication)
   - [POST /api/auth/register](#post-apiauthregister)
   - [POST /api/auth/login](#post-apiauthlogin)
2. [Conversations](#conversations)
   - [GET /api/conversations](#get-apiconversations)
   - [GET /api/conversations/{conversation_id}](#get-apiconversationsconversation_id)
   - [POST /api/conversations](#post-apiconversations)
   - [POST /api/conversations/{conversation_id}/connect](#post-apiconversationsconversation_idconnect)
3. [Messages](#messages)
   - [POST /api/messages](#post-apimessages)
4. [User Profile](#user-profile)
   - [GET /api/users/{user_id}](#get-apiusersuser_id)

---

## Conversations

### GET /api/conversations/{conversation_id}

- **Description**: Retrieves all messages from a specific conversation.
- **Parameters**:
  - `conversation_id`: ID of the conversation to retrieve.
- **Response (200 OK)**:

  ```json
  [
    {
      "sender_id": "uuid",
      "message": "Hi, how are you?",
      "timestamp": "2025-02-22T12:01:00Z"
    },
    {
      "sender_id": "uuid",
      "message": "I'm good, thanks!",
      "timestamp": "2025-02-22T12:02:00Z"
    }
  ]
  ```

### POST /api/conversations/{conversation_id}/connect

- **Description**: Establishes a WebSocket connection for real-time communication in the specific conversation.
- **Parameters**:
  - `conversation_id`: ID of the conversation to connect to.
- **Response (200 OK)**:

  ```json
  {
    "status": "WebSocket connected",
    "conversation_id": "uuid"
  }
  ```

---

## Messages

### POST /api/messages/

- **Description**: Sends a new message in a conversation.
- **Request Body (JSON)**:

  ```json
  {
    "conversation_id": "uuid",
    "sender_id": "uuid",
    "message": "Hello, how are you?"
  }
  ```

- **Response (200 OK)**:

  ```json
  {
    "message_id": "uuid",
    "message": "Hello, how are you?",
    "timestamp": "2025-02-22T12:03:00Z"
  }
  ```

---

## User Profile

### GET /api/users/{user_id}

- **Description**: Retrieves the profile information of a user.
- **Parameters**:
  - `user_id`: ID of the user to retrieve the profile for.
- **Response (200 OK)**:

  ```json
  {
    "user_id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "profile_picture": "https://example.com/profile.jpg"
  }
  ```

### GET /api/users/

- **Description**: Retrieves all users rofiles.
- **Response (200 OK)**:

  ```json
  [{
    "user_id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "profile_picture": "https://example.com/profile.jpg"
  }]
  ```

---

## Error Handling

All responses will include the following error structure when appropriate:

- **Response (Error)**:

  ```json
  {
    "error": {
      "message": "Error description",
      "status": 400
    }
  }
  ```

---

## Notes

- **JWT Token**: All routes that require authentication will need a valid JWT token included in the `Authorization` header as `Bearer <JWT_token>`.
- **is_ai flag**: In the `POST /api/conversations` route, if `is_ai` is set to `true`, the conversation will be between the user and an AI agent. If `is_ai` is `false`, the conversation will be between two users.
- **WebSocket**: A WebSocket connection is established for real-time communication in a conversation by calling the `POST /api/conversations/{conversation_id}/connect` endpoint. Once the WebSocket connection is established, messages can be sent and received in real-time.
