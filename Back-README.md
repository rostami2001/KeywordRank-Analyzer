# Project Title

### Overview

This project is a Node.js-based backend application using Express for building RESTful APIs. The app connects to a MongoDB database and provides routes for managing sites, keywords, and dashboard data.

---

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Routes](#api-routes)
- [License](#license)

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Ensure you have MongoDB installed and running.

---

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   MONGO_URI=<your-mongodb-connection-string>
   PORT=3000
   ```

2. Replace `<your-mongodb-connection-string>` with your MongoDB connection URI.

---

## Usage

1. Start the server:

   ```bash
   node app
   ```

2. The application will run on `http://localhost:3004` by default.

---

## Folder Structure

```
backend/
├── routes/             # Route handlers
├── models/             # Mongoose schemas
├── uploads/            # File upload storage
├── app.js              # Main application entry point
├── package.json        # Project dependencies
├── .env                # Environment variables
```

---

## API Routes

### Sites

- `GET /sites` - Retrieve all sites
- `POST /sites` - Add a new site

### Keywords

- `GET /keywords` - Retrieve all keywords
- `POST /keywords` - Add a new keyword

### Dashboard

- `GET /dashboard` - Retrieve dashboard data

For detailed API documentation, refer to the respective route files in the `routes/` folder.

---

## License

This project is licensed under the [MIT License](LICENSE).
