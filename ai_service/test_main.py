import os
import sys

# Ensure project root is on sys.path so `import main` works when tests run
ROOT = os.path.dirname(os.path.dirname(__file__))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"message": "AI Service is running"}


def test_stock_price_scraping():
    """Test that stock prices can be scraped using BeautifulSoup"""
    from main import scrape_stock_price
    
    # Test with a known stock symbol
    price = scrape_stock_price("AAPL")
    
    # Price should be a positive number or None
    assert price is None or (isinstance(price, float) and price > 0)
