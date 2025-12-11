El Jardin Ordering and Booking System

Overview:
  El Jardin is a full-stack web application designed to streamline restaurant operations. It allows users to order food and book services online while helping restaurant staff manage orders and bookings efficiently. The system improves service speed, reduces errors, and provides a modern digital platform for both customers and restaurant management.


Features:
  User Authentication: Sign up, login, and manage user accounts.
  Food Ordering: Browse menu items and place orders online.
  Booking System: Reserve tables or services in advance.
  Admin Dashboard: Manage orders, bookings, and view logs.
  Order and User Logs: Track all activities in real-time for better management.

Tech Stack
Frontend:
  React
  Tailwind CSS
  Vite

Backend:
  Node.js

Database:
  MySQL

Additional Tools / Libraries:
  Axios / Fetch API
  React Router
  Nodemon

Installation & Setup

1. Clone the repository
  git clone <repository-url>
  cd el-jardin

2. Install frontend dependencies
  cd frontend
  npm install

3. Install backend dependencies
  cd backend
  npm install

4. Configure environment variables
  Create a `.env` file in the backend folder and add your database credentials and server settings:
  
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=yourpassword
  DB_NAME=eljardin
  PORT=5000
  
5. Run the backend server
  npm run dev

6. Run the frontend
  cd frontend
  npm run dev

7. Access the application
 Frontend: `http://localhost:5173` (Vite default port)
 Backend API: `http://localhost:5000`

Database Structure
Users – stores user information
Orders – stores food order details
Bookings – stores table or service reservations
Logs – records activities for users, orders, and bookings

