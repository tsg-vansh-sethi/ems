from pymongo import MongoClient
from dotenv import load_dotenv
import os,redis

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
load_dotenv(dotenv_path)

mongo_uri = os.getenv("MONGO_URI")
redis_client = redis.StrictRedis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    password=os.getenv("REDIS_PASSWORD"),
    ssl=True,  # Mandatory for Azure Redis Azure Redis only supports connections over TLS/SSL by default. This means:
    #If ssl=False, the connection will fail.
    decode_responses=True #decode_responses=True ensures that responses are returned as strings instead of bytes.
)
if not mongo_uri:
    raise ValueError("MONGO_URI not found in environment variables!")

client = MongoClient(mongo_uri)
#select database and collection
my_database=client["EMS"]
my_collection=my_database["users"]
audit_collection=my_database["audit_logs"]
faker_collection=my_database["faker"]

 