import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:

    load_dotenv()
    GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]

    SUPABASE_DB_URL:str = os.environ["SUPABASE_DB_URL"]

   