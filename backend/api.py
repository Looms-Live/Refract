"""
Vercel handler for FastAPI backend
"""
from app import app

# This is needed for Vercel to properly handle the FastAPI app
handler = app
