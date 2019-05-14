from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from apiclient import errors
import base64
import email
from bs4 import BeautifulSoup
import xml_parse


class Gmail():

  def create_service(self):
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.modify']
    creds = None
  
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server()
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('gmail', 'v1', credentials=creds)
    return service

  def query_unread_emails(self,service,search_term):
      #messages will contain message info including the message id
      
      if(search_term=='chant'):
        print("###############   CHANT  ################")
        messages=self.ListMessagesMatchingQuery(service,'me','from:googlealerts-noreply@google.com is:unread subject:chant')
      elif(search_term=='ritual'):
        print("###############   RITUAL  ################")
        messages=self.ListMessagesMatchingQuery(service,'me','from:googlealerts-noreply@google.com is:unread subject:ritual')
      else:
        print('error with search term')
        exit()
        
      if(len(messages)>0):
          result = self.GetMimeMessage(service,'me',str(messages[0]['id']))
          email_html=('"""'+result+'"""')
          link = self.get_rss_link(email_html)
          service.users().messages().modify(userId='me', id=messages[0]['id'], body={'removeLabelIds': ['UNREAD']}).execute() 
          return link
          
      else:
        print('No new emails about news alerts for search term '+search_term)      
    
  def get_rss_link(self,email_html):
      
      if(email_html is not 'error'):
          soup = BeautifulSoup(email_html, 'html.parser')
          links = []
              
          for link in soup.find_all('a'):
              links.append(str(link.get('href')))

          num_of_links = len(links)
          rss_link = links[num_of_links-2].replace('3D','')
          rss_link = rss_link[rss_link.find("http")-1:]
          rss_link = rss_link.replace("\\","")[1:-1]
          rss_link = rss_link.replace("=rn","")
          links.clear()
          return str(rss_link)    
      else:
          exit()

  def GetMimeMessage(self,service, user_id, msg_id):

    try:
      message = service.users().messages().get(userId=user_id, id=msg_id,format='raw').execute()
      msg_str = base64.urlsafe_b64decode(message['raw'].encode('ASCII'))

      mime_msg = email.message_from_string(str(msg_str))
 
      return(str(mime_msg))
    
    except(errors.HttpError):
      print('An error occurred:')

  def GetMessage(self,service, user_id, msg_id):

  
    message = service.users().messages().get(userId=user_id, id=msg_id).execute()

    return message

  def ListMessagesMatchingQuery(self,service, user_id, query=''):

    try:
      response = service.users().messages().list(userId=user_id,
                                                q=query).execute()
      messages = []
      if 'messages' in response:
        messages.extend(response['messages'])

      while 'nextPageToken' in response:
        page_token = response['nextPageToken']
        response = service.users().messages().list(userId=user_id, q=query,
                                          pageToken=page_token).execute()
        messages.extend(response['messages'])
      
      return messages
    except(errors.HttpError):
      print('An error occurred: %s')

def main():
  search_term='chant'
  gmail_api = Gmail()
  service = gmail_api.create_service()
  rss_link = gmail_api.query_unread_emails(service,search_term)
  print(rss_link)

if __name__ == '__main__':
  main()
