🚀 ShoppyGlobe Backend API
Project Overview
The ShoppyGlobe Backend API is a robust e-commerce backend solution built with Node.js and Express. It provides core functionalities for user authentication, product management, and shopping cart operations, interacting with a MongoDB database.

Features
User Authentication: Register and log in users with secure password hashing (bcrypt.js) and JSON Web Token (JWT) based authentication.

Product Management: API endpoints to list, retrieve, and manage product details (currently public, but easily extendable for admin roles).

Shopping Cart: Functionality to add, update quantity, retrieve, and remove items from a user's persistent shopping cart.

Data Validation: Utilizes Joi for robust input validation on all critical API endpoints.

Error Handling: Centralized middleware for graceful error handling and 404 responses.

Technologies Used
Node.js: JavaScript runtime environment.

Express.js: Fast, unopinionated, minimalist web framework for Node.js.

MongoDB: NoSQL database for storing application data.

Mongoose: MongoDB object data modeling (ODM) for Node.js.

Bcrypt.js: For hashing and salting passwords.

JSON Web Token (JWT): For secure user authentication.

Joi: For data validation.

Dotenv: For managing environment variables.

Nodemon: (Development dependency) For automatic server restarts during development.

⚙️ Setup and Installation
Follow these steps to get the ShoppyGlobe Backend API up and running on your local machine.

1. Clone the Repository
   Bash

git clone https://github.com/<your_username>/shoppyglobe-backend.git
cd shoppyglobe-backend
Replace <your_username> with your actual GitHub username.

2. Install Dependencies
   Bash

npm install 3. MongoDB Setup
You need a running MongoDB instance. Choose one of the following methods:

Local MongoDB Community Server (Recommended for Development):

Download and install MongoDB Community Server from the official MongoDB website.

During installation on Windows, ensure it's set up as a service. On macOS, if using Homebrew, start the service: brew services start mongodb-community@6.0.

Verify the mongod.exe process is running (check Task Manager on Windows, or ps aux | grep mongod on macOS/Linux).

The default URI mongodb://localhost:27017/shoppyglobe in the .env.example will connect to this local instance.

MongoDB Atlas (Cloud-Hosted MongoDB):

Create a free-tier account and cluster on MongoDB Atlas.

Create a new Database User (remember username and password).

Configure Network Access to whitelist your IP address or allow access from anywhere (for testing).

Copy the connection string provided by Atlas (it will start with mongodb+srv://).

4. Environment Variables
   Create a file named .env in the root of your project. Copy the content from .env.example into your new .env file and fill in your actual values.

.env.example content:

Code snippet

PORT=5000
MONGO_URI=mongodb://localhost:27017/shoppyglobe # Use your local or Atlas URI
JWT_SECRET=your_super_secret_jwt_key_here # Generate a strong, random string 5. Run the Server
Bash

nodemon server.js
The console should display:

MongoDB Connected: <your_mongo_host>
Server running on port 5000
🧪 API Endpoints and Testing with Postman
All API interactions can be tested using Postman. An exported Postman collection is included in this repository (ShoppyGlobe API Test.json).

Import the Postman Collection:

Open Postman.

Click "Import" -> "Upload Files" and select ShoppyGlobe API Test.json from this repository.

Set up Postman Environment:

In Postman, go to the "Environments" tab on the left.

Create a new environment named "ShoppyGlobe Local".

Add the following variables:

baseUrl: http://localhost:5000/api

jwtToken: (Leave initial value empty; it will be set by the login request).

Ensure "ShoppyGlobe Local" is selected in the environment dropdown in the top right of Postman.

Authentication Endpoints (/api/auth)

1. Register User
   Method: POST

URL: {{baseUrl}}/auth/register

Access: Public

Description: Creates a new user account.

Request Body (JSON):

JSON

{
"username": "testuser",
"email": "test@example.com",
"password": "password123"
}
Expected Response (201 Created):

JSON

{
"\_id": "60d...",
"username": "testuser",
"email": "test@example.com",
"token": "eyJhbGciO...",
"createdAt": "2023-..."
}
Postman Screenshot:

2. Login User
   Method: POST

URL: {{baseUrl}}/auth/login

Access: Public

Description: Authenticates a user and returns a JWT token. This token is required for accessing protected routes.

Request Body (JSON):

JSON

{
"email": "test@example.com",
"password": "password123"
}
Expected Response (200 OK):

JSON

{
"\_id": "60d...",
"username": "testuser",
"email": "test@example.com",
"token": "eyJhbGciO..."
}
Postman Screenshot:
Note: The Postman collection includes a "Tests" script for this request to automatically set the jwtToken environment variable.

Product Endpoints (/api/products)

1. Create Product
   Method: POST

URL: {{baseUrl}}/products

Access: Public (can be set to Private/Admin with protect middleware)

Description: Adds a new product to the database.

Request Body (JSON):

JSON

{
"name": "Smartphone X",
"price": 50000,
"description": "Latest flagship smartphone with advanced features.",
"stockQuantity": 25,
"imageUrl": "https://example.com/smartphone.jpg"
}
Expected Response (201 Created):

JSON

{
"\_id": "60e...",
"name": "Smartphone X",
"price": 50000,
"description": "...",
"stockQuantity": 25,
"imageUrl": "...",
"createdAt": "...",
"updatedAt": "..."
}
Postman Screenshot:
Note: Copy the \_id from the response and save it as a productId environment variable for easier testing of other product/cart routes.

2. Get All Products
   Method: GET

URL: {{baseUrl}}/products

Access: Public

Description: Retrieves a list of all products.

Expected Response (200 OK):

JSON

[
{
"_id": "60e...",
"name": "Smartphone X",
"price": 50000,
"description": "...",
"stockQuantity": 25,
"imageUrl": "...",
"createdAt": "...",
"updatedAt": "..."
}
// ... more products
]
Postman Screenshot:

3. Get Single Product
   Method: GET

URL: {{baseUrl}}/products/{{productId}}

Access: Public

Description: Retrieves details for a single product by its ID.

Expected Response (200 OK):

JSON

{
"\_id": "60e...",
"name": "Smartphone X",
"price": 50000,
"description": "...",
"stockQuantity": 25,
"imageUrl": "...",
"createdAt": "...",
"updatedAt": "..."
}
Error Response (404 Not Found): If product ID is invalid or not found.

Postman Screenshot:

Cart Endpoints (/api/cart)

1. Add Product to Cart
   Method: POST

URL: {{baseUrl}}/cart

Access: Private (Requires JWT Authorization header)

Description: Adds a specified quantity of a product to the authenticated user's cart. Creates a new cart if one doesn't exist.

Headers: Authorization: Bearer {{jwtToken}}

Request Body (JSON):

JSON

{
"productId": "{{productId}}",
"quantity": 2
}
Expected Response (201 Created):

JSON

{
"\_id": "60f...",
"user": "60d...",
"items": [
{
"product": "60e...",
"quantity": 2,
"priceAtAddToCart": 50000,
"_id": "60f..."
}
],
"createdAt": "...",
"updatedAt": "..."
}
Error Response (400 Bad Request): If insufficient stock or invalid input.

Postman Screenshot:

2. Update Cart Item Quantity
   Method: PUT

URL: {{baseUrl}}/cart/{{productId}}

Access: Private (Requires JWT Authorization header)

Description: Updates the quantity of a specific product in the authenticated user's cart.

Headers: Authorization: Bearer {{jwtToken}}

Request Body (JSON):

JSON

{
"quantity": 5
}
Expected Response (200 OK):

JSON

{
"\_id": "60f...",
"user": "60d...",
"items": [
{
"product": "60e...",
"quantity": 5, // Updated quantity
"priceAtAddToCart": 50000,
"_id": "60f..."
}
],
"createdAt": "...",
"updatedAt": "..."
}
Postman Screenshot:

3. Get User Cart
   Method: GET

URL: {{baseUrl}}/cart

Access: Private (Requires JWT Authorization header)

Description: Retrieves the entire shopping cart for the authenticated user.

Headers: Authorization: Bearer {{jwtToken}}

Expected Response (200 OK):

JSON

{
"\_id": "60f...",
"user": "60d...",
"items": [
{
"product": {
"_id": "60e...",
"name": "Smartphone X",
"price": 50000,
"imageUrl": "..."
},
"quantity": 5,
"priceAtAddToCart": 50000,
"_id": "60f..."
}
],
"createdAt": "...",
"updatedAt": "..."
}
Postman Screenshot:

4. Remove Product from Cart
   Method: DELETE

URL: {{baseUrl}}/cart/{{productId}}

Access: Private (Requires JWT Authorization header)

Description: Removes a specific product from the authenticated user's cart.

Headers: Authorization: Bearer {{jwtToken}}

Expected Response (200 OK):

JSON

{
"message": "Product removed from cart"
}
Postman Screenshot:

🗄️ MongoDB Database Verification
These screenshots confirm that data is being correctly stored and managed in your MongoDB database.

Users Collection: Displays the user(s) created via the registration endpoint.

Products Collection: Displays the product(s) added via the product creation endpoint.

Carts Collection: Displays the cart entry for your user, reflecting the products added/updated in the cart.

📚 Code Structure
A brief overview of the project directory structure:

shoppyglobe-backend/
├── .env # Environment variables (local, not committed)
├── .env.example # Template for environment variables
├── .gitignore # Specifies intentionally untracked files
├── package.json # Project metadata and dependencies
├── server.js # Main application entry point
├── config/ # Database connection configuration
│ └── db.js
├── models/ # Mongoose schemas for data models
│ ├── User.js
│ ├── Product.js
│ └── Cart.js
├── routes/ # API endpoint definitions
│ ├── authRoutes.js
│ ├── productRoutes.js
│ └── cartRoutes.js
├── middleware/ # Custom Express middleware (auth, error, validation)
│ ├── authMiddleware.js
│ ├── errorMiddleware.js
│ └── validationMiddleware.js
├── utils/ # Utility functions (e.g., Joi validation schemas)
│ └── validationSchemas.js
└── README.md # Project documentation (this file)
└── ShoppyGlobe API Test.json # Exported Postman Collection
