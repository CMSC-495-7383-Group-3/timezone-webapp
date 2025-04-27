"""This module dynamically loads the appropriate settings based on an environment variable."""
import os

env = os.getenv('DJANGO_ENV', 'development')
if env == 'production':
    from .production import *
else:
    from .development import *
