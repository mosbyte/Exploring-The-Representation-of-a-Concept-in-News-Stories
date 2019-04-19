from bs4 import BeautifulSoup
import sys
import pprint
from os import path
import urllib.request
import datetime
import json
import re
from pymongo import MongoClient 

class scrape():

	news_items = dict()
	news_items['items'] = []

	def remove_markdown(self,news_text):
		unwanted = ['<b>','</b>','&nbsp;...', '&#39;', '&quot;', '\u201c', '\u201d']
		return re.sub("|".join(unwanted),"",news_text)

	def format_date_time(self,date_str):
		d = datetime.datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%SZ")
		return d.strftime("%d %b %y - %H:%M")

	def parse_source_link(self, link):
		html_fragments = ['<link href=', '/>', 'https://www.google.com/url?rct=j&amp;sa=t&amp;url=' ]
		parsed_link = re.sub("|".join(html_fragments),"",link)
		end_of_link = parsed_link.find('ct=ga')-5
		start_of_link = ((parsed_link.find('url=')+4))
		parsed_link = parsed_link[start_of_link:end_of_link]
		
		return parsed_link
		
	def parse_news_source(self,link):
		try:
			if 'url=https://' in link:
				link = link.replace('url=https://','url=http://')
			source = re.search('url=http://(.+?)/',link).group(1)
			
			if source.startswith('www.'):
				source = source.replace('www.','')
	
		except AttributeError:
			source = 'unknown'

		return source

	def store_data(self,titles,contents,published,source):

		for i in range(len(contents)):
			headline = self.remove_markdown(titles[i+1].get_text())
			briefing = self.remove_markdown(contents[i].get_text())
			released = self.format_date_time(published[i].get_text())
			news_source = self.parse_news_source(str(source[i+1]))
			source_link = self.parse_source_link(str(source[i+1]))
			# print(source_link)

			story = (
				{
					'title':headline, 
					'contents':briefing,
					'date': datetime.datetime.strptime(released, "%d %b %y - %H:%M"),
					'published':released,
					'source':news_source,
					'link':source_link,
					'CreatedAt': datetime.datetime.now(),
					'status': 'new',
				}
			)
			self.news_items['items'].append(story) 

	def scrape_xml(self,url):

		try:
			source = urllib.request.urlopen(url).read()
			soup = BeautifulSoup(source,'lxml')

			titles = soup.find_all('title')
			contents = soup.find_all('content')
			published = soup.find_all('published')
			source = soup.find_all('link')
			self.store_data(titles,contents,published,source)

		except:
			print("No Valid RSS link received")
		
		data = self.news_items['items']
		self.news_items['items'] = []
		return data

