# Job Portal Backend

This is the backend for the **Job Portal** application. It provides RESTful APIs for user authentication, job management, applications, company profiles, and file uploads. Built with **Node.js**, **Express**, and **MongoDB**.

---

## Features

* User registration and login with JWT authentication
* Update user profile and upload profile pictures
* CRUD operations for jobs
* Apply for jobs and upload resumes
* Track and manage applications (status, employer view, recent applications)
* Company profile management
* Password reset functionality
* Recommended jobs for users

---

## Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB** with **Mongoose**
* **JWT** for authentication
* **Multer** for file uploads

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd Job_Portal_Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following keys:

```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
```

4. Start the server:

```bash
npm start
```

The backend will run at: `http://localhost:5000`

---

## API Routes

### **Authentication**

| Method | Endpoint       | Description                           |
| ------ | -------------- | ------------------------------------- |
| POST   | /auth/register | Register a new user                   |
| POST   | /auth/login    | Login user                            |
| GET    | /auth/me       | Get current user info (auth required) |
| PUT    | /auth/update   | Update profile (auth required)        |

---

### **Jobs**

| Method | Endpoint              | Description                                    |
| ------ | --------------------- | ---------------------------------------------- |
| POST   | /jobs/jobpost         | Create a job (auth required)                   |
| GET    | /jobs/joballsearch    | Get all jobs                                   |
| GET    | /jobs/jobsearch/\:id  | Get single job by ID (auth required)           |
| GET    | /jobs/companyjob      | Get jobs by logged-in employer (auth required) |
| PUT    | /jobs/updatejob/\:id  | Update job (auth required)                     |
| DELETE | /jobs/delete/\:id     | Delete job (auth required)                     |
| GET    | /jobs/recommendedjobs | Get recommended jobs (auth required)           |

---

### **Applications**

| Method | Endpoint                        | Description                               |
| ------ | ------------------------------- | ----------------------------------------- |
| POST   | /applications/applyjob          | Apply for a job (auth required)           |
| GET    | /applications/applicant/\:id    | Get applicant details (auth required)     |
| GET    | /applications/myjob/            | Get my applications (auth required)       |
| PUT    | /applications/statuschange      | Update application status (auth required) |
| GET    | /applications/checkstatus/\:id  | Check application status (auth required)  |
| GET    | /applications/applicationmy     | Get employer applications (auth required) |
| GET    | /applications/recent            | Get recent applications (auth required)   |
| GET    | /applications/applicantdet/\:id | Get application details (auth required)   |
| GET    | /applications/job/\:jobId       | Get applicants for a job (auth required)  |

---

### **Company**

| Method | Endpoint        | Description                                           |
| ------ | --------------- | ----------------------------------------------------- |
| POST   | /company/create | Create or update company profile (auth required)      |
| PUT    | /company/update | Update company profile (auth required)                |
| GET    | /company/me     | Get company profile of logged-in user (auth required) |

---

### **Password Reset**

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | /password/forget | Request password reset |
| POST   | /password/reset  | Reset password         |

---

### **File Uploads**

| Method | Endpoint      | Description                            |
| ------ | ------------- | -------------------------------------- |
| POST   | /user/resume  | Upload resume (auth required)          |
| POST   | /user/profile | Upload profile picture (auth required) |

* File uploads are handled using **Multer** and stored in the `/uploads` directory.

---

## Notes

* Make sure MongoDB is running or provide a cloud URI.
* All protected routes require a valid **JWT token**.
* Error handling is implemented for missing fields, invalid data, and file uploads.

---

## License

MIT License

---

If you want, I can **also create a section with example API requests and responses** so anyone using your backend can test endpoints easily in Postman or Swagger.

Do you want me to add that?
