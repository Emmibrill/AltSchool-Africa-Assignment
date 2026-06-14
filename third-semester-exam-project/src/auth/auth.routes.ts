import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

/**
* @swagger
* tags:
* name: Authentication
* description: User Authentication Endpoints
  */

/**
* @swagger
* /api/auth/register:
* post:
* ``` summary: Register a new user ```
* ``` tags: [Authentication] ```
* ``` requestBody: ```
* ``` required: true ```
* ``` content: ```
* ``` application/json: ```
* ``` schema: ```
* ``` type: object```
* ``` required: ```
* ``` - name ```
* ``` - email ```
* ``` - password ```
* ``` - role ```
* ``` properties: ```
* ``` name: ```
* ``` type: string ```
* ``` example: Emmanuel ```
* ``` email: ```
* ``` type: string ```
* ``` example: emmanuel@gmail.com ```
* ``` password: ```
* ``` type: string ```
* ``` example: emmibrill000 ```
* ``` role: ```
* ``` type: string ```
* ``` enum: ```
* ``` - CREATOR ```
* ``` - EVENTEE ```
* ``` responses: ```
* ``` 201: ```
* ``` description: User registered successfully ```
* ``` 400: ```
* ``` description: Validation error ```

*/

router.post("/register", AuthController.register);

/**
* @swagger
* /api/auth/login:
* post:
* ``` summary: Login user ```
* ``` tags: [Authentication] ```
* ``` requestBody: ```
* ``` required: true ```
* ``` content: ```
* ``` application/json: ```
* ``` schema: ```
* ``` type: object ```
* ``` required: ```
* ``` - email ```
* ``` - password ```
* ``` properties: ```
* ``` email: ```
* ``` type: string ```
* ``` example: emmibrill@gmail.com ```
* ``` password: ```
* ``` type: string ```
* ``` example: passwordbrill123 ```
* ``` responses: ```
* ``` 200: ```
* ``` description: Login successful ```
* ``` 401: ```
* ``` description: Invalid credentials ```

*/

router.post("/login", AuthController.login);

export default router;

