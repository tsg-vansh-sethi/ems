# from pymongo import MongoClient
# from dotenv import load_dotenv
# import os

# load_dotenv()

# mongo_uri = os.getenv("MONGO_URI")

# if not mongo_uri:
#     raise ValueError("MONGO_URI not found in environment variables!")

# client = MongoClient(mongo_uri)
# #select database and collection
# my_database=client["EMS"]
# my_collection=my_database["users"]
# audit_collection=my_database["audit_logs"]

audit_collection = {}
my_collection={}