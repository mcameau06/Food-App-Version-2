from contextlib import asynccontextmanager
import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from app.database.schemas import Base, engine
from app.api.v1.favorites import router as favorites_router
from app.api.v1.restaurant import router as restaurant_router
from app.api.v1.search import router as search_router

@asynccontextmanager
async def lifespan(app:FastAPI):
    #Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(favorites_router)
app.include_router(restaurant_router)
app.include_router(search_router)

load_dotenv()

# CORS configuration: read allowed frontend origins from env,
# defaulting to localhost for development.
frontend_origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173")
allow_origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["GET","PUT","POST","DELETE"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Normalize HTTPException responses into a consistent JSON shape.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Return clean validation errors for invalid requests (422).
    """
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Catch-all handler to avoid leaking stack traces to clients.
    """
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
        },
    )
