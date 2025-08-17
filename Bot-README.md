# README

## Overview
This Python script is designed to automate the process of searching specific keywords on Google and tracking the ranking of associated websites. The program interacts with MongoDB to retrieve keywords, performs web scraping via Selenium, and stores the results in a database and an Excel file for analysis.

Key functionalities include:
- Fetching keywords and related sites from a MongoDB database.
- Performing Google searches for each keyword.
- Tracking the ranking of specified sites in the search results.
- Saving the results to a MongoDB collection and an Excel file.
- Running the script for multiple cycles with configurable intervals between runs.

## Requirements
To run this script, you'll need the following Python libraries and tools:

- `pymongo`: MongoDB Python client
- `pandas`: Data manipulation and analysis
- `selenium`: Web automation tool
- `openpyxl`: Excel support for pandas (for saving results)
- `chromedriver`: Ensure you have ChromeDriver installed (Selenium uses this for web automation)

You can install these dependencies using `pip`:

```bash
pip install pymongo pandas selenium openpyxl
```

Ensure that you have the correct version of `chromedriver` matching your Chrome browser version. You can download it from [here](https://sites.google.com/chromium.org/driver/).

## Setup

1. **MongoDB Setup**:  
   Ensure MongoDB is running locally on your system or update the `MONGO_URI` in the script to point to a different MongoDB instance.

2. **Database Collections**:  
   The script expects the following collections in the MongoDB database `keywords_db`:
   - `keywords`: Contains keyword documents with their respective sites and daily limits.
   - `sites`: Stores site information with their domains.
   - `logs`: Records the search logs with timestamp, keyword, site, and rank.
   
   Ensure that these collections exist in your MongoDB database.

3. **Excel Output**:  
   The results will be saved to an Excel file named `output_analysis.xlsx`. You can modify this file name by changing the `results_file` variable in the script.

## Script Functionality

### Key Functions:

1. **Database Connection**:
   - The script connects to a MongoDB instance to load keywords and associated websites.
   
2. **Google Search Automation**:
   - Uses Selenium to search Google for each keyword.
   - Scrapes the results to find the sites associated with the keyword.
   - Tracks the ranking of each site in the search results.

3. **Daily Limits**:
   - Each keyword has a daily limit, and the script ensures that a keyword is only searched if its daily usage count is below the limit.

4. **Logging**:
   - Logs the rank of each site found for a keyword.
   - Stores logs in the `logs` collection of the MongoDB database.

5. **Results Analysis**:
   - After scraping, the script analyzes the results to determine the best and worst ranks for each keyword and site.
   - Outputs the analysis to an Excel file.

6. **Multiple Cycles**:
   - The script runs for a configurable number of cycles (`MAX_CYCLES`), with a pause between each cycle (`RUN_INTERVAL_MINUTES`).

7. **MongoDB Cleanup**:
   - After completing all cycles, the script deletes all documents from the `keywords` collection.

### Example Workflow:
- The script starts by checking if necessary MongoDB collections exist and creates them if not.
- It loads the keywords from the database, checking their daily usage limit.
- For each keyword, the script performs a Google search and records the rank of associated sites in the search results.
- The results are saved to a log in MongoDB and analyzed for statistics (min, max, and average rank).
- The final analysis is saved to an Excel file for further review.

## Configuration

1. **MONGO_URI**:  
   The URI to connect to your MongoDB instance. Default is `"mongodb://localhost:27017"`.

2. **DB_NAME**:  
   The name of the database used to store the data. Default is `"keywords_db"`.

3. **KEYWORDS_COLLECTION**:  
   The collection in MongoDB that contains the keywords. Default is `"keywords"`.

4. **SITES_COLLECTION**:  
   The collection in MongoDB that contains the associated websites. Default is `"sites"`.

5. **LOGS_COLLECTION**:  
   The collection for storing search logs. Default is `"logs"`.

6. **results_file**:  
   Path to the Excel file where the analyzed results will be saved. Default is `"output_analysis.xlsx"`.

7. **RUN_INTERVAL_MINUTES**:  
   Time interval (in minutes) between each execution cycle. Default is `2`.

8. **MAX_CYCLES**:  
   Number of times the script should run. Default is `4`.

## How to Run

1. Make sure you have MongoDB running and have the necessary collections set up.
2. Ensure that the script is properly configured (adjust paths, intervals, etc.).
3. Run the script:

```bash
python keyword_rank_scraper.py
```

The script will execute for the configured number of cycles, performing Google searches and saving results.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.