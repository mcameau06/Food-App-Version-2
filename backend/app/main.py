from contextlib import asynccontextmanager
from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
from starlette.types import Lifespan
from database.schemas import Base,engine






#origins = list(os.getenv("ORIGINS").split(","))

@asynccontextmanager
async def lifespan(app:FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

load_dotenv()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





import routes