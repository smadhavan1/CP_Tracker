# CP Tracker

A full-stack web application for tracking competitive programming questions across multiple platforms. Users can organize their problem-solving progress and track performance through a personalized dashboard.

**Live Demo:** [CP Tracker](https://cp-tracker-sepia.vercel.app)

## Why I Built This

I built CP Tracker because I wanted a better way to keep track of the questions I solve while practicing competitive programming. After practicing competitive programming for a while, it became difficult for me to remember which questions I had done, which ones I wanted to revise and where I had written my notes. I thought that building my own tracker would help me to solve that problem while also giving me a chance to build a full-stack application.

## Features

* User authentication with Passport.js
* Authorization to ensure users can only manage their own questions
* Create, view, update and delete questions
* Track question status (Solved, Attempted, Not Started)
* Mark questions as favourites
* Add tags, notes, solution links and revision schedules
* Search, filter and sort questions
* Personalized dashboard with charts
* Toast notifications for user feedback
* Server-side validation and error handling
* Responsive interface built with Bootstrap

## Tech Stack

### Frontend

* EJS Templates
* Bootstrap
* HTML
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Other Tools

* Passport.js
* Chart.js
* Joi
* express-session
* toastify-js

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CP_Tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file and add the following variables:

* `REGISTRATIONS_ENABLED` : Boolean value to enable or disable new user registrations
* `DB_URL`                : MongoDB connection string
* `SESSION_SECRET`        : Secret used to sign session cookies
* `STORE_SECRET`          : Secret used by connect-mongo to encrypt session data 

### 4. Start the Application

```bash
npm start
```

### 5. Open in Browser

Visit:

```text
http://localhost:3000
```

## Screenshots

### Home Page
<img width="1920" height="1080" alt="Home Page" src="https://github.com/user-attachments/assets/2eaf606a-e557-4459-8b1b-f7685bc4d300" />

### Dashboard
#### Difficulty and Status Distribution
<img width="1323" height="689" alt="Difficulty and Status Distribution" src="https://github.com/user-attachments/assets/7e0f50ff-db8c-4d92-a51a-f5aa8b24ba27" />

#### Platform Distribution
<img width="1260" height="664" alt="Platform Distribution" src="https://github.com/user-attachments/assets/047cecea-df54-4686-bb9d-ae9e44329471" />

#### Topic Distribution
<img width="1253" height="664" alt="Tag Distribution" src="https://github.com/user-attachments/assets/04958bac-ddf5-4772-a47d-94428e2e2356" />

### Questions Index Page
<img width="1920" height="1080" alt="Questions Index Page" src="https://github.com/user-attachments/assets/fd7e1fbd-29d3-43cf-8e7e-a91e40bb6a86" />

### Question Details Page
<img width="1920" height="570" alt="Question Details Page" src="https://github.com/user-attachments/assets/8d1f86e3-9c48-47aa-8290-54aed49d95f7" />

### Create Question Page
<img width="1920" height="1078" alt="Create Question Page" src="https://github.com/user-attachments/assets/7b72fae9-3273-4148-9e04-1ea8c4f13bdb" />

### Edit Question Page
<img width="1920" height="1080" alt="Edit Question Page" src="https://github.com/user-attachments/assets/05a094b0-cf06-41ca-8473-14515df8c103" />
