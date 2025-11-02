from fastapi import FastAPI
from bs4 import BeautifulSoup
import requests

app = FastAPI()


@app.get("/health")
def health_check():
    return {"message": "AI Service is running"}


def scrape_stock_price(symbol: str) -> float | None:
    """
    Scrape stock price from Yahoo Finance using BeautifulSoup.
    
    Args:
        symbol: Stock ticker symbol (e.g., 'AAPL', 'NVDA')
        
    Returns:
        Current stock price as float, or None if scraping fails
    """
    try:
        url = f"https://finance.yahoo.com/quote/{symbol.upper()}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Try to find the current price using various selectors
        # Yahoo Finance uses fin-streamer tags with data-field attributes
        fin_streamer = soup.find('fin-streamer', {'data-field': 'regularMarketPrice', 'data-symbol': symbol.upper()})
        if fin_streamer:
            try:
                # Get the text content
                price_text = fin_streamer.get_text(strip=True)
                price_text = price_text.replace(',', '').replace('$', '')
                price = float(price_text)
                # Sanity check: stock prices are typically between $1 and $10,000
                if 1 <= price <= 10000:
                    return price
            except (ValueError, AttributeError):
                pass
        
        # Fallback: try to find by data-testid
        span_element = soup.find('span', {'data-testid': 'qsp-price'})
        if span_element:
            try:
                price_text = span_element.get_text(strip=True)
                price_text = price_text.replace(',', '').replace('$', '')
                price = float(price_text)
                if 1 <= price <= 10000:
                    return price
            except (ValueError, AttributeError):
                pass
        
        return None
        
    except Exception as e:
        print(f"Error scraping stock price for {symbol}: {e}")
        return None


@app.get("/stock/{symbol}")
def get_stock_price(symbol: str):
    """
    Get current stock price by scraping Yahoo Finance.
    
    Args:
        symbol: Stock ticker symbol
        
    Returns:
        JSON with stock symbol and current price
    """
    price = scrape_stock_price(symbol)
    
    if price is None:
        return {
            "symbol": symbol.upper(),
            "price": None,
            "status": "error",
            "message": "Could not retrieve stock price"
        }
    
    return {
        "symbol": symbol.upper(),
        "price": price,
        "status": "success"
    }
