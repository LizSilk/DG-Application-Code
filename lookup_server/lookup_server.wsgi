import sys

# used by apache to access the flask application
# works despite python complaining that app doesn't exist
sys.path.insert(0, "C:\\Users\\BXS301\\OneDrive - Powerco Limited\\Documents\\GitHub\\Distributed_Generation_Form_Backend\\lookup_server")
from lookup_server import app as application
