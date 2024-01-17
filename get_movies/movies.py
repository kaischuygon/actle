"""
    This script scrapes the top rated films in the US region from TMDb and exports the data to a JSON file for the web app to use.

    Creates:
        movies.json - a JSON file containing the movie's name, year, URL, TMDb ID, actors, and poster


    Install dependencies:
        pip install numpy requests python-dotenv tqdm

    Usage:
        python movies.py
        
    Optional arguments:
        --limit - an integer for the limit of movies to scrape
            python movies.py --limit 10

"""

import numpy as np
import requests
import os
from dotenv import load_dotenv
import json
import logging
import concurrent.futures
import argparse

# Create a parser
parser = argparse.ArgumentParser(description='Process some integers.')
# Add the 'limit' argument
parser.add_argument('--limit', type=int, help='an integer for the limit')

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

def get_movies_from_page(page:int):
    """
        Gets the movies from a page of the top rated movies from TMDb

        Args:
            page (int): the page number

        Returns:
            list: a list of movie objects
    """
    movies = []
    logger.info(f"Getting page {page}")
    # TMDb /discover endpoint https://developer.themoviedb.org/reference/discover-movie
    url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={page}&region=US&sort_by=vote_count.desc"

    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MWQ4Yzk5ODg0ZDk4MmZiMDEyNDdjM2ZjYzhlOWM5NiIsInN1YiI6IjYxZmI4NDljNjRkZTM1MDBlMTBhODQwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SyIl_ulBWBG8FiApEUfcn5JhoHIk64i6VYWjNgcWQ-M"
    }

    response = requests.get(url, headers=headers)
    
    data = json.loads(response.text)
    results = data['results']
    for result in results:
        cast = []
        casturl = f"https://api.themoviedb.org/3/movie/{result['id']}/credits?language=en-US"
        response = requests.get(casturl, headers=headers)
        data = json.loads(response.text)
        cast = data['cast']
        cast = [{'name': actor['name'], 'image': f"https://image.tmdb.org/t/p/w500{actor['profile_path']}"} for actor in cast]
        movie_obj ={
            'Name': result['title'],
            'Year': int(result['release_date'][:4]),
            'URL': f'https://themoviedb.org/movie/{result["id"]}',
            'TMDb ID': result['id'],
            'Actors': cast[:6], # get max the first 6 actors
            'Poster': f"https://image.tmdb.org/t/p/w500{result['poster_path']}"
        }

        movies.append(movie_obj)
    
    return movies

def get_top_rated_movies(limit:int = 5):
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        pages = list(range(1, limit + 1))
        results = executor.map(get_movies_from_page, pages)
    
    # flatten the list of lists
    movies = [movie for page in results for movie in page]
    return movies

# main function
if __name__ == "__main__":
    logger.info("Starting to scrape pages")
    if args.limit:
        logger.info(f"Limiting to {args.limit} pages")
        movies = get_top_rated_movies(int(args.limit))
    else:
        movies = get_top_rated_movies()

    # randomize the order of the movies
    logger.info("Randomizing the order of the movies")
    np.random.shuffle(movies)
    movies_json = json.dumps(movies, indent=4, sort_keys=True)

    logger.info("Exporting movies.json")
    # export the json object to a file
    with open('movies.json', 'w') as outfile:
        outfile.write(movies_json)

    logger.info("Sucessfully scraped {} movies".format(len(movies)))
        