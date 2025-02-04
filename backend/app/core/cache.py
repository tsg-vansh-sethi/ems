from db import redis_client,my_collection
import json
def refresh_cache(key):
    """
    Refreshes the Redis cache by clearing old data and storing fresh data from MongoDB.
    """
    
    # Step 1: Delete old cache
    redis_client.delete(key)
    
    # Step 2: Fetch fresh data from MongoDB
    users_cursor = my_collection.find()
    users_list = [{**user, "_id": str(user["_id"])} for user in users_cursor]
    
    # Step 3: Store fresh data in Redis with expiration time
    redis_client.setex(key, 3600, json.dumps(users_list))

    return {"message": "Cache refreshed successfully", "total_users": len(users_list)}