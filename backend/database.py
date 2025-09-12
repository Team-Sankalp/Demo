import mysql.connector
from config import DB_CONFIG

def get_connection():
    """Create and return a new MySQL connection."""
    return mysql.connector.connect(
        host=DB_CONFIG["host"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        database=DB_CONFIG["database"]
    )
