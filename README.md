# Exploring the Representation of a Concept in News Stories - Code Execution Guidelines

**Tomás Mc Phillips - 15382091**

**Explanation of Project**
The code contained in this Repo is that used for my Final Year Project which involved creating a custom research tool. I developed a dynamic database of web-scraped stories, added to daily with a Python script that interacts with the GmailAPI & MongoDB. The MERN stack was used for front-end and back-end design & development for this full stack project. I deployed the solution to a Linux server. The tool is live and used in research.

## To Perform the Collection of News Stories

1. Python version 3 and pip version 3 are requirement. The following dependencies are needed.
2. Download and install MongoDB based on your operating system following the guidelines of this online tutorial from MongoDB, https://docs.mongodb.com/manual/installation/.
    1. `pip install BeautifulSoup`
    2. `pip install pymongo`
    3. `pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib`
3. To use an example data set and add to it, open the command line and change directory to fyp_mern/. Run the first command for bash terminals and the second for windows. The paths should be changed to suit your system. 
    1. `sudo mongorestore --db chant_ritual --drop /pathto/chant_ritual/`
    2. `mongorestore -h localhost -d chant -o C:\pathto\chant_ritual`

**The Python files in the python directory perform the following operations:**

**collect_new_stories.py**   - Run this script to collect news stories for chant and ritual and add them to their appropriate database collection. The collection process handles chant first and then ritual.

**gmail_collect.py**    -   This file will connect to the gmail account chantritual1@gmail.com using the credentials.json and token.pickle file. It will open any unread emails for chant and ritual, scrape their RSS link and marke the email as closed.

**xml_parse.py**  -   This file contains the Scrape class which is responsible for web scraping a RSS link received, cleaning the data set and then returning the data so it can be stored in the database.

**mongo_news_db.py**  -   Stories retrieved are added to their correct database collection based on the database term received, either chant or ritual.

**cloneDB.py**    -   Cloning a database and its collections can be performed with this script. The user must specify in the file the exact database name they wish to clone and the name which they wish it to be cloned under.


To collect news stories over the command line, change directory to where the collect_new_stories.py file is contained and run:
`python collect_new_stories.py`

## To Host the Web Application Locally

The file structure of this stack has the routes for chant and ritual, the Node.JS web server and mongoose schema defined in the fyp_mern directory. All fron end components exist in the fyp_mern/client directory with reused components being in a components dircectory.

1. Install Node.JS on your system. Online tutorial: https://nodejs.org/ for all platforms.
2. In the directory fyp_mern/client run the following command
    1. `npm -i axios bootstrap recharts react-charts react-router-dom`
3. In the directory fyp_mern/ run the following command
    1. `npm -i express body-parser cors mongoose`
4. In the fyp_mern directory run the following command in the terminal suited to your system. This will startup the node web server locally on port 5000 and will access the database of example data restored in part 4 above.
    1.  BASH:  `nodejs server.js`
    2. Windows: `node server.js`
5. In a new terminal open change to the directory fyp_mern/client and run the following command to host the ReactJS front end locally on port 3000:
    1. `npm start`

