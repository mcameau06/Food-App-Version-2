import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))


load_dotenv()
GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]

SUPABASE_DB_URL:str = os.environ["SUPABASE_DB_URL"]

SUPABASE_JWT_SECRET = os.environ["SUPABASE_JWT_SECRET"]


   