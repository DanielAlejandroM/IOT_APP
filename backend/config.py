import os 
from datetime import timedelta

SECRET_KEY = os.getenv("SECRET_KEY", "H18wx3uKajv10ZMCfqZsTlzQAQyXo")
ALGORITHM =  os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))