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

from dotenv import load_dotenv
import numpy as np
import requests
import os
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
    url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={page}&region=US&sort_by=vote_count.desc"

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_API_TOKEN}"
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        logger.error(f"Error getting page {page} (status code {response.status_code}) header {response.headers}")
    
    data = json.loads(response.text)
    results = data['results']
    for result in results:
        movie_id = result['id']
        movie_details = f"https://api.themoviedb.org/3/movie/{movie_id}?append_to_response=credits&language=en-US"
        response = requests.get(movie_details, headers=headers)
        details = json.loads(response.text)
        cast = [{'name': actor['name'], 'image': f"https://image.tmdb.org/t/p/w500{actor['profile_path']}"} for actor in details['credits']['cast']]
        # Get director
        for crew in details['credits']['crew']:
            if crew['job'] == 'Director':
                director = crew['name']
                break
        # Get top 6 actors and reverse the order
        actors = cast[:6]
        actors.reverse()
        movie_obj ={
            'Name': result['title'],
            'Year': int(result['release_date'][:4]),
            'URL': f'https://themoviedb.org/movie/{result["id"]}',
            'TMDb ID': result['id'],
            'Actors': actors,
            'Poster': f"https://image.tmdb.org/t/p/w500{result['poster_path']}",
            # Hints are genre(s), director, release year
            'Hints' : {
                'Genres': ", ".join([genre['name'] for genre in details['genres']]),
                'Director': director if director else "Unknown",
                'Release Year': int(details['release_date'][:4])
            }
        }

        movies.append(movie_obj)
    
    return movies

def get_top_rated_movies(limit:int = 1):
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        pages = list(range(1, limit + 1))
        results = executor.map(get_movies_from_page, pages)
    
    # flatten the list of lists
    movies = [movie for page in results for movie in page]
    return movies

# main function
if __name__ == "__main__":
    load_dotenv()
    global TMDB_API_TOKEN
    TMDB_API_TOKEN = os.getenv("TMDB_API_TOKEN")
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
        