from pymongo import MongoClient
import datetime
import json

class cloneDB():
    
    client = MongoClient('mongodb://localhost:27017/')

    def get_stories(self, db, collection):
        news_items = dict()
        news_items['items'] = []
        # once a client exists perform the following
        with self.client:

            # create a db for the client of the name in brackets
            db = self.client[db]
            # print(db)
            collection = db[collection]
            for items in collection.find():
                date = datetime.datetime.strptime(items['published'], "%d %b %y - %H:%M")
                createdAtTerm = ''
                if 'createdAt' in items:
                    createdAtTerm += 'createdAt'
                else:
                    createdAtTerm += 'CreatedAt'

                if 'UpdatedAt' in items:
                    story = (
                        {
                            'title': items['title'],
                            'contents': items['contents'],
                            'date': date,
                            'published': items['published'],
                            'source': items['source'],
                            'link': items['link'],
                            'CreatedAt': items[createdAtTerm],
                            'status': items['status'],
                            'UpdatedAt': items['UpdatedAt'],
                            'tags': items['tags']
                        }
                    )
                else:
                    story = (
                        {
                            'title': items['title'],
                            'contents': items['contents'],
                            'date': date,
                            'published': items['published'],
                            'source': items['source'],
                            'link': items['link'],
                            'CreatedAt': items[createdAtTerm],
                            'status': items['status'],
                        }
                    )
                news_items['items'].append(story)

        return news_items['items']


    def add_to_db(self, new_db, collection, data):

        with self.client:
            # create a db for the client of the name in brackets
            db = self.client[new_db]
            coll = db[collection]

            counter = len(data)
            for d in data:
                coll.insert_one(d)
            print(str(counter)+" stories added to db")


    def clone(self, db, collection, new_db):
        data = self.get_stories(db, collection)
        self.add_to_db(new_db, collection, data)


def main():
    db = 'chant_ritual'
    new_db = 'chant_ritual_clone'+datetime.datetime.utcnow()
    collections = ['all_chant_news', 'all_ritual_news']
    
    database = cloneDB()
    database.clone(db, collections[0], new_db)
    database.clone(db, collections[1], new_db)
    
if __name__ == "__main__":
    main()
