# Vehicle Service Management Platform

An end-to-end web platform for managing vehicle service centers, appointments, users, invoices, and service records. Built with a modern React frontend and Node.js/Express backend, using MongoDB for data storage.

---

## Application Flow

1. **User Registration & Login**
	- Users can register as Customers or login as Admin, Staff, or Technician (see sample credentials below).
	- Authentication is handled via JWT tokens.

2. **Booking a Service**
	- Customers can add vehicles and book service appointments.
	- Available slots and service types are displayed dynamically.

3. **Service Management**
	- Admins and Staff can view, assign, and manage appointments.
	- Technicians see their assigned tasks and update service status.

4. **Service Tracking & History**
	- Customers can track the status of their service in real-time and view service history.

5. **Invoice & Payment**
	- After service completion, invoices are generated.
	- Customers can view/download invoices and simulate payments.

6. **Notifications**
	- Email notifications are sent for important events (booking, status updates, invoice generation).

---

## Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React, Vite, CSS          |
| Backend    | Node.js, Express          |
| Database   | MongoDB (Atlas)           |
| Auth       | JWT                       |
| Email      | Nodemailer                |
| File Upload| Multer, Cloudinary (opt.) |

---

## Folder Structure

```
Vehicle_service_management_platform/
├── client/        # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── ...
├── server/        # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── ...
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone the repository:**
	```sh
	git clone <repo-url>
	cd Vehicle_service_management_platform
	```

2. **Backend setup:**
	```sh
	cd server
	npm install
	# Create a .env file (see .env.example or below)
	npm start
	```
	Example `.env`:
	```env
	MONGO_URI=your_mongodb_connection_string
	PORT=5000
	```

3. **Frontend setup:**
	```sh
	cd ../client
	npm install
	npm run dev
	```

4. **Access the app:**
	- Frontend: http://localhost:5173 (default Vite port)
	- Backend API: http://localhost:5000

---

## Usage

1. Register as a customer or login as admin/staff/technician (see credentials below).
2. Add vehicles, book services, and track status.
3. Admins/Staff manage appointments and users.
4. Technicians update service progress.
5. View/download invoices and simulate payments.

---

## Environment Variables

- Backend: `server/.env` (MongoDB URI, PORT, email config)
- Frontend: `client/.env` (if using environment variables for API URLs)

---

## Sample Credentials

- **Admin:** admin@gmail.com / 123


---

## License

This project is for educational/demo purposes.
