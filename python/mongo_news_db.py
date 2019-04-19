from pymongo import MongoClient 
import xml_parse
import json
import datetime
class Database():

	def add_to_correct_db(self,term, data):
		try:
			if(term=='chant'):
				print("adding to chant database\n")
				self.add_to_chant_db(data)
			elif(term=='ritual'):
				print("adding to ritual database\n")
				self.add_to_ritual_db(data)
			else:
				print("Error with term")

		except:
			print("Error adding data to db for this term")

	def add_to_chant_db(self, data):
		# creating the local client for the database
		client = MongoClient('mongodb://localhost:27017/')
		# once a client exists perform the following
		with client:
			# create a db for the client of the name in brackets
			db = client["chant_ritual"]
			chant = db['all_chant_news']

			counter = len(data)
			# go through every news story and provide input options for the story on the command line
			for d in data:
				chant.insert_one(d)
			
			with open("additions_to_db.txt", "a") as myfile:
				myfile.write(str(counter)+" stories added to chant db - "+str(datetime.datetime.utcnow())+'\n')
			print(str(counter)+" stories added to chant db")

	def add_to_ritual_db(self, data):
		# creating the local client for the database
		client = MongoClient('mongodb://localhost:27017/')

		# once a client exists perform the following
		with client:

			# create a db for the client of the name in brackets
			db = client["chant_ritual"]
			ritual = db['all_ritual_news']
			counter = len(data)
			# go through every news story and provide input options for the story on the command line
			for d in data:
				ritual.insert_one(d)
			with open("additions_to_db.txt", "a") as myfile:
				myfile.write(str(counter)+" stories added to ritual db - "+str(datetime.datetime.utcnow())+'\n')
			print(str(counter)+" stories added to ritual db")
