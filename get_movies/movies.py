"""
    Helper script to scrape the Letterboxd website for the movie's TMDb ID and then get the movie's details from TMDb.

    Returns:
        movies_with_actors.csv - a CSV file containing the movie's name, year, URL, TMDb ID, actors, and poster
        movies.json - a JSON file containing the movie's name, year, URL, TMDb ID, actors, and poster (used by the web app)


    Install dependencies:
        pip install pandas numpy requests beautifulsoup4 python-dotenv tqdm

    Usage:
        python movies.py
        
    Optional arguments:
        --limit - an integer for the limit of movies to scrape
            python movies.py --limit 10
        --file - a path to a CSV file containing the movies to scrape. See movies.csv for an example

"""

import pandas as pd
import numpy as np
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
import json
import logging
from tqdm import tqdm
import argparse

# Create a parser
parser = argparse.ArgumentParser(description='Process some integers.')
# Add the 'limit' argument
parser.add_argument('--limit', type=int, help='an integer for the limit')
# Add the 'file' argument
parser.add_argument('--file', type=str, help='a path to a CSV file containing the movies to scrape')

# Parse the arguments
args = parser.parse_args()

class CustomFormatter(logging.Formatter):
    grey = "\x1b[38;20m"
    yellow = "\x1b[33;20m"
    red = "\x1b[31;20m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    format = "[%(asctime)s %(name)s %(levelname)s %(filename)s:%(lineno)d] %(message)s"

    FORMATS = {
        logging.DEBUG: grey + format + reset,
        logging.INFO: grey + format + reset,
        logging.WARNING: yellow + format + reset,
        logging.ERROR: red + format + reset,
        logging.CRITICAL: bold_red + format + reset
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)

# create logger with ''
logger = logging.getLogger("movies")
logger.setLevel(logging.DEBUG)

# create console handler with a higher log level
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

ch.setFormatter(CustomFormatter())

logger.addHandler(ch)

load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

def get_tmdb_ids(movies):
    '''Scrape the Letterboxd website for the movie's TMDb ID'''
    logger.info("Scraping Letterboxd for TMDb IDs")
    movies['TMDb ID'] = -1

    # Loop through the movies and scrape the TMDb ID
    for index, row in tqdm(movies.iterrows(), total=movies.shape[0]):
        # Skip movies that already have a TMDb ID
        if row['TMDb ID'] != -1:
            continue
        
        # Get the movie's Letterboxd URL
        url = row['URL'] + '/details'
        # Get the movie's TMDb ID
        page = requests.get(url)
        soup = BeautifulSoup(page.content, 'html.parser')
        body = soup.find('body')
        tmdb_id = body.get('data-tmdb-id')
        # Add the TMDb ID to the dataframe
        movies.at[index, 'TMDb ID'] = int(tmdb_id)
    
    if movies['TMDb ID'].isnull().any():
        logger.warning(f"{movies['Actors'].isnull().count()} movies do not have a TMDb ID")

    logger.info("Finished scraping Letterboxd for TMDb IDs")

def get_movie_details(movies):
    '''Get the movie's details from TMDb'''
    movies['Actors'] = [[] for _ in range(len(movies))]
    movies['Poster'] = ''

    # Loop through the movies and get the movie's details
    for index, row in tqdm(movies.iterrows(), total=movies.shape[0]):
        # Skip movies that already have actors listed
        if len(row['Actors']) > 0:
            continue

        # Get the movie's TMDb ID
        tmdb_id = row['TMDb ID']
        
        # Get the movie's cast
        url = f"https://api.themoviedb.org/3/movie/{tmdb_id}/credits?language=en-US"
        headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {TMDB_API_KEY}"
        }

        response = requests.get(url, headers=headers)
        data = json.loads(response.text)
        cast = data['cast']
        # limit to 6 actors
        cast = cast[:6]
        # Add the cast to the dataframe as a list of 6 actor names
        movies.at[index, 'Actors'] = [actor['name'] for actor in cast]

        # Get poster image
        url = f'https://api.themoviedb.org/3/movie/{tmdb_id}/images?language=en'
        response = requests.get(url, headers=headers)
        data = json.loads(response.text)
        poster = data['posters'][0]['file_path']
        # Add the poster to the dataframe
        movies.at[index, 'Poster'] = f'https://image.tmdb.org/t/p/w500{poster}'

    if movies['Actors'].isnull().any():
        logger.warning(f"{movies['Actors'].isnull().count()} movies do not have actors")
    if movies['Poster'].isnull().any():
        logger.warning(f"{movies['Actors'].isnull().count()} movies do not have a poster")

    movies.head()

# main function
if __name__ == "__main__":
    logger.info(f"Loading {args.file if args.file else 'movies.csv'}")
    # Load the movies.csv file, up to args.limit
    if args.limit is not None:
        movies = pd.read_csv(args.file if args.file else 'movies.csv', sep=',', encoding='latin-1', usecols=['Name', 'Year', 'URL'], nrows=args.limit)
    else:
        movies = pd.read_csv(args.file if args.file else 'movies.csv', sep=',', encoding='latin-1', usecols=['Name', 'Year', 'URL'])
    
    get_tmdb_ids(movies)
    get_movie_details(movies)
    
    movies_json = movies.to_json(orient='records')
    parsed = json.loads(movies_json)

    # randomize the order of the movies
    logger.info("Randomizing the order of the movies")
    np.random.shuffle(parsed)
    movies_json = json.dumps(parsed, indent=4, sort_keys=True)

    logger.info("Exporting movies.json")
    # export the json object to a file
    with open('movies.json', 'w') as outfile:
        outfile.write(movies_json)

    # print the dataframe if limit is set
    if args.limit is not None:
        print(movies.head(args.limit))
    else:
        print(movies.head())