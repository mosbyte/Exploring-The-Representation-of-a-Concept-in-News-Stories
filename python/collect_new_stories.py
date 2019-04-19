import gmail_collect
import xml_parse
import mongo_news_db

def main():
    search_terms = ['chant','ritual']

    gmail_api = gmail_collect.Gmail()
    service = gmail_api.create_service()
    
    for term in search_terms:
        rss_link = gmail_api.query_unread_emails(service,term)
        scraper = xml_parse.scrape()
        data = scraper.scrape_xml(rss_link)
        db = mongo_news_db.Database()
        db.add_to_correct_db(term,data)
        data = []

if __name__ == "__main__":
    main()