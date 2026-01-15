from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.database.schemas import Base,engine
from app.api.v1.favorites import router as favorites_router
from app.api.v1.restaurant import router as restaurant_router
from app.api.v1.search import router as search_router

@asynccontextmanager
async def lifespan(app:FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)


app.include_router(favorites_router)
app.include_router(restaurant_router)
app.include_router(search_router)


load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET","PUT","POST","DELETE"],
    allow_headers=["*"],
)
