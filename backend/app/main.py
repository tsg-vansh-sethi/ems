from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router
#cors situation comes up when frontemd runs with js code and this code communicates with backend code and
#in that case our backend is in different origin
# app = FastAPI()
#  metadata-to pass data about api we do
app=FastAPI(
    title="User Api",
    terms_of_service="https://www.google.com",
    description="Get users details from here",
    contact={
        "name": "Vansh Sethi",
        "url": "https://www.google.com",
        "email": "demo@gmail.com",
    },
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow React app to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


# Include the user API router
# app.include_router is This is telling FastAPI to include the routes from the user_router into the main FastAPI application (app). 
# #The user_router contains the logic for the /login, /register, and any other routes related to users, as defined in app/api/user.py.
app.include_router(router) # prefix tells every route defined will have /users(if defined) as prefix
#meaning routes will be /users/login etc
