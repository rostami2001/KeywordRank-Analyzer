# Keyword Rank Tracker

This project is a web-based application for tracking website rankings for specific keywords. It includes a Vue.js frontend, a Node.js backend, and a Python bot for retrieving ranking data from search engines.

## Features

- Track rankings of websites for multiple keywords.
- Calculate minimum, maximum, and average rankings.
- Visualize ranking trends with line charts.
- Display ranking data in a structured table.
- Filter results by date range, website, or keyword.

## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Pip](https://pip.pypa.io/en/stable/) (Python package manager)

## Project Structure

- **frontend**: Vue.js application located in `src/`.
- **backend**: Node.js server located in `server/server.js`.
- **bot**: Python script for fetching rankings located in `server/bot.py`.
- **assets**: Fonts, images, and styles.
- **public**: Static files and configuration data.

## Getting Started

Follow these steps to set up and run the project.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd keyword-rank
```

### 2. Install Dependencies

#### Frontend

```bash
npm install
```

#### Backend

Navigate to the `server` folder and install dependencies:

```bash
cd server
npm install
```

#### Bot

Install required Python packages:

```bash
pip install -r requirements.txt
```

### 3. Run the Project

#### Start the Backend Server

From the `server` directory:

```bash
node server.js
```

The backend will start on `http://localhost:3000`.

#### Start the Frontend

From the project root:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`.

#### Run the Bot

From the `server` directory:

```bash
python bot.py
```

The bot will fetch rankings and store them in the database.

## Configuration

- **Frontend**: Modify API endpoints in `src/utils/index.js`.
- **Backend**: Update database configuration in `server.js`.
- **Bot**: Update search engine and ranking parameters in `bot.py`.

## Screenshots

1. **Dashboard**: View keyword ranking trends over time.
2. **Data Table**: Display minimum, maximum, and average rankings.
3. **Filters**: Refine data by date, keyword, or website.

## Contribution

Feel free to fork this repository and submit pull requests for new features or bug fixes.

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Support

For issues or questions, please open an issue in this repository.
