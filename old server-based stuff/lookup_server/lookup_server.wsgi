import sys

# used by apache to access the flask application
# works despite python complaining that app doesn't exist
sys.path.insert(0, "/old server-based stuff/lookup_server")
