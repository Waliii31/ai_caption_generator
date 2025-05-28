from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import routes  # importing your API

app = FastAPI()

# Allow frontend CORS
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes
app.include_router(routes.router)
