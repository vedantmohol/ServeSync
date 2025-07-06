<p align="center">
  <img src="https://servesync.onrender.com/assets/logo.png" alt="ServeSync Logo" width="300"/>
</p>

<h1 align="center">🍽️ ServeSync</h1>
<p align="center">Restaurant Order & Staff Management System built with MERN Stack</p>

---

## 🚀 Features

- 👨‍🍳 Add, edit, remove staff (chefs, waiters, hall managers)
- 🍲 Add, edit, remove food items
- 🧾 Place orders (online & offline)
- 💳 UPI payments using Razorpay
- 📦 Table and kitchen assignment for orders
- 📈 Track revenue and GST through bills
- 💬 Add/edit/delete comments and reviews
- 🔐 Auth + role-based access control
- 💡 Auto GST logic based on staff count

---

## 🌐 Live Site

- 🔗 [https://servesync.onrender.com](https://servesync.onrender.com)

---

## 🛠️ Setup Instructions (Local)

> Requires Node.js, npm, and MongoDB Atlas

# 1. Clone the repository

git clone https://github.com/your-username/servesync.git
cd servesync

# 2. Backend setup

cd backend
npm install
Add a .env file in the backend with necessary keys like Mongo URI and Razorpay

# 3. Frontend setup

cd ../frontend
npm install
Add a .env file in frontend with your Razorpay key ID

# 4. Start servers

In backend/
npm run dev

In frontend/
npm run dev

---

## 📁 API Base URL
https://servesync.onrender.com/api

---

## 📬 Postman Collection
📂 Postman Collection Gist : [GitHub Gist](https://gist.github.com/vedantmohol/e257b0608b2c9384580803724c340441)

## 🧭 API Routes
# 🔐 Auth (/api/auth)
| Method | Endpoint  | Description   |
| ------ | --------- | ------------- |
| POST   | `/signup` | Register user |
| POST   | `/signin` | Login user    |


# 👤 Customer (/api/customer)
| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/test`            | Test route               |
| PUT    | `/update/:userId`  | Update profile           |
| DELETE | `/delete/:userId`  | Delete account           |
| POST   | `/signout`         | Logout                   |
| POST   | `/verify-password` | Verify password securely |


# 🏨 Hotel & Staff (/api/hotel)
| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/register`          | Register hotel               |
| GET    | `/get`               | Fetch all hotels             |
| POST   | `/addStaff`          | Add staff to hotel           |
| PATCH  | `/updateStaff`       | Update staff details         |
| PATCH  | `/removeStaff`       | Remove a staff member        |
| GET    | `/getStaff`          | Get all staff for hotel      |
| POST   | `/addStructure`      | Add floors, tables, kitchens |
| GET    | `/getBills`          | Get billing summary with GST |
| GET    | `/getHotelTables`    | Fetch tables of hotel        |
| GET    | `/available-waiters` | Get list of free waiters     |


# 🍽️ Food (/api/food)
| Method | Endpoint                   | Description     |
| ------ | -------------------------- | --------------- |
| POST   | `/add`                     | Add new food    |
| GET    | `/get`                     | Fetch all foods |
| GET    | `/get/:hotelId/:foodId`    | Get one food    |
| PATCH  | `/update/:hotelId/:foodId` | Update a food   |
| DELETE | `/delete/:foodId`          | Delete a food   |


# 📦 Orders (/api/order)
| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/placeOrder`        | Place offline order              |
| POST   | `/place-online`      | Place online Razorpay order      |
| POST   | `/create-order`      | Create Razorpay order            |
| GET    | `/getStructure`      | Get hotel structure (tables etc) |
| GET    | `/getManagerOrders`  | Get manager orders               |
| GET    | `/getChefOrders`     | Get chef-specific orders         |
| GET    | `/get-waiter-orders` | Get waiter-assigned orders       |
| PATCH  | `/assign-waiter`     | Assign waiter                    |
| PATCH  | `/updateOrder`       | Update order status              |
| PATCH  | `/markCompleted`     | Mark order as complete           |
| PATCH  | `/update-delivery`   | Update delivery ETA              |
| POST   | `/generateBill`      | Generate bill                    |
| PUT    | `/bookTable`         | Book a table                     |
| PUT    | `/unbookTable`       | Free a booked table              |
| GET    | `/orderhistory`      | Order history for user           |


# 💬 Comments (/api/comment)
| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| POST   | `/createComment`            | Create comment                 |
| GET    | `/getComments/:hotelId`     | Get comments by hotel          |
| PATCH  | `/editComment/:commentId`   | Edit comment (auth required)   |
| DELETE | `/deleteComment/:commentId` | Delete comment (auth required) |


## 📌 Notes
-Role-based access for admin and customers
-Orders automatically assigned to staff
-Auto GST based on staff count
-Bill summary includes: subtotal, GST, grand total
-Razorpay test UPI flow works smoothly

<p align="center"> Made with 💜 by Vedant Mohol </p>
