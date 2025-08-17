import pymongo
import pandas as pd
import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "keywords_db"
KEYWORDS_COLLECTION = "keywords"
SITES_COLLECTION = "sites"
LOGS_COLLECTION = "logs"

results_file = "output_analysis.xlsx"

RUN_INTERVAL_MINUTES = 2
MAX_CYCLES = 2

def get_today():
    return time.strftime("%Y-%m-%d")

def load_keywords_from_db():
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]
    keywords_collection = db[KEYWORDS_COLLECTION]

    today = get_today()
    keywords_data = []

    for keyword_doc in keywords_collection.find():
        keyword = keyword_doc["keyword"]
        daily_limit = keyword_doc.get("daily_limit", 2)
        daily_count = keyword_doc.get("daily_count", {}).get(today, 0)

        if daily_count < daily_limit:
            sites = []

            for site_id in keyword_doc["sites"]:
                site = db[SITES_COLLECTION].find_one({"_id": site_id})
                if site:
                    sites.append(site["domain"])

            keywords_data.append({
                "keyword": keyword,
                "sites": sites,
                "_id": keyword_doc["_id"]
            })

    client.close()

    random.shuffle(keywords_data)
    return keywords_data

def update_keyword_count(keyword_id):
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]
    keywords_collection = db[KEYWORDS_COLLECTION]

    today = get_today()
    keyword_doc = keywords_collection.find_one({"_id": keyword_id})
    if keyword_doc:
        daily_count = keyword_doc.get("daily_count", {})
        daily_count[today] = daily_count.get(today, 0) + 1

        keywords_collection.update_one(
            {"_id": keyword_id},
            {"$set": {"daily_count": daily_count}}
        )

    client.close()

def ensure_collections():
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]

    if LOGS_COLLECTION not in db.list_collection_names():
        db.create_collection(LOGS_COLLECTION)
        print(f"Collection '{LOGS_COLLECTION}' created.")

    client.close()

def save_results_to_excel(file_path, results):
    df = pd.DataFrame(results)
    df.to_excel(file_path, index=False)

def save_log_to_db(keyword, site, rank):
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DB_NAME]
    logs_collection = db[LOGS_COLLECTION]

    log_entry = {
        "keyword": keyword,
        "site": site,
        "rank": rank,
        "timestamp": time.time()
    }

    logs_collection.insert_one(log_entry)
    client.close()

def search_google(keywords_data):
    results = []
    max_results = 50

    driver = webdriver.Chrome()

    for keyword_data in keywords_data:
        keyword = keyword_data["keyword"]
        sites = keyword_data["sites"]
        keyword_id = keyword_data["_id"]

        print(f"Searching for: {keyword}")

        driver.get("https://www.google.com")
        search_box = driver.find_element(By.NAME, "q")
        search_box.send_keys(keyword)
        search_box.send_keys(Keys.RETURN)
        time.sleep(2)

        total_checked = 0
        while total_checked < max_results:
            search_results = driver.find_elements(By.CSS_SELECTOR, "div.tF2Cxc")
            global_rank = total_checked + 1
            for result in search_results:
                if total_checked >= max_results:
                    break

                link = result.find_element(By.TAG_NAME, "a").get_attribute("href")

                for site in sites:
                    if site in link:
                        results.append({
                            "keyword": keyword,
                            "site": site,
                            "rank": global_rank
                        })
                        print(f"Found {site} at rank {global_rank} for {keyword}")

                        save_log_to_db(keyword, site, global_rank)

                total_checked += 1
                global_rank += 1

            if total_checked < max_results:
                try:
                    next_button = driver.find_element(By.ID, "pnnext")
                    next_button.click()
                    time.sleep(2)
                except Exception:
                    print("No more pages to process.")
                    break
            else:
                break

        update_keyword_count(keyword_id)

    driver.quit()
    return results

def analyze_results(raw_results):
    analyzed_data = []
    grouped = pd.DataFrame(raw_results).groupby(["keyword", "site"])

    for (keyword, site), group in grouped:
        ranks = group["rank"]
        analyzed_data.append({
            "کلمه کلیدی": keyword,
            "دامنه سایت": site,
            "کمترین رتبه": ranks.min(),
            "بیشترین رتبه": ranks.max(),
            "میانگین رتبه": ranks.mean(),
            "تعداد بررسی": len(ranks)
        })

    return analyzed_data

def run_bot():
    ensure_collections()

    keywords_data = load_keywords_from_db()

    raw_results = search_google(keywords_data)

    analyzed_results = analyze_results(raw_results)

    save_results_to_excel(results_file, analyzed_results)
    print(f"Results saved to {results_file}")

if __name__ == "__main__":
    cycle_count = 0

    while cycle_count < MAX_CYCLES:
        print(f"Starting cycle {cycle_count + 1}/{MAX_CYCLES}")
        run_bot()
        cycle_count += 1

        if cycle_count < MAX_CYCLES:
            time.sleep(RUN_INTERVAL_MINUTES * 60)

    try:
        client = pymongo.MongoClient(MONGO_URI)
        db = client[DB_NAME]
        keywords_collection = db[KEYWORDS_COLLECTION]

        delete_result = keywords_collection.delete_many({})
        print(f"Deleted {delete_result.deleted_count} documents from '{KEYWORDS_COLLECTION}' collection.")
    except Exception as e:
        print(f"Error while deleting documents: {e}")
    finally:
        client.close()

    print("Bot execution completed.")
