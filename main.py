from fastapi import FastAPI
from bs4 import BeautifulSoup
import requests
from datetime import datetime

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


def scrape_latest_news(limit: int = 20) -> list[dict]:
    """
    Get latest financial news from TheNewsAPI.
    
    Args:
        limit: Maximum number of news items to return
        
    Returns:
        List of news articles with title, summary, source, and timestamp
    """
    try:
        # TheNewsAPI endpoint for business/finance news
        api_key = "AEGLcQ519KsgbCefKfSvU9efvxAF2OA11CoJ4MTS"
        url = f"https://api.thenewsapi.com/v1/news/all"
        
        params = {
            "api_token": api_key,
            "search": "stock market OR finance OR economy OR stocks",
            "categories": "finance,business",
            "language": "en",
            "limit": limit,
            "sort": "published_at"
        }
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=15)
        response.raise_for_status()
        
        data = response.json()
        news_items = []
        
        if 'data' in data and isinstance(data['data'], list):
            for article in data['data']:
                try:
                    title = article.get('title', '')
                    url_link = article.get('url', '')
                    description = article.get('description', article.get('snippet', ''))
                    source = article.get('source', 'Unknown')
                    published_at = article.get('published_at', '')
                    
                    if title and url_link:
                        news_items.append({
                            "title": title,
                            "summary": description[:300] if description and len(description) > 300 else (description or ""),
                            "source": source,
                            "timestamp": published_at,
                            "url": url_link,
                            "scraped_at": datetime.utcnow().isoformat()
                        })
                except Exception as e:
                    print(f"Error parsing article: {e}")
                    continue
        
        return news_items[:limit]
        
    except Exception as e:
        print(f"Error fetching news from TheNewsAPI: {e}")
        return []


@app.get("/news")
def get_latest_news(limit: int = 20):
    """
    Get latest market news from TheNewsAPI.
    
    Args:
        limit: Maximum number of news items to return (default: 20)
        
    Returns:
        JSON with list of news articles
    """
    news_items = scrape_latest_news(limit)
    
    return {
        "status": "success",
        "count": len(news_items),
        "articles": news_items
    }


def get_stock_price_from_marketstack(symbol: str) -> dict | None:
    """
    Get stock price from MarketStack API.
    
    Args:
        symbol: Stock ticker symbol (e.g., 'AAPL', 'NVDA')
        
    Returns:
        Dictionary with stock data or None if failed
    """
    try:
        api_key = "78f80408061373d9936046aee69ada20"
        url = "http://api.marketstack.com/v1/eod/latest"
        
        params = {
            "access_key": api_key,
            "symbols": symbol.upper(),
            "limit": 1
        }
        
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        
        data = response.json()
        
        if 'data' in data and isinstance(data['data'], list) and len(data['data']) > 0:
            stock_data = data['data'][0]
            return {
                "symbol": symbol.upper(),
                "price": stock_data.get('close'),
                "open": stock_data.get('open'),
                "high": stock_data.get('high'),
                "low": stock_data.get('low'),
                "volume": stock_data.get('volume'),
                "date": stock_data.get('date')
            }
        
        return None
        
    except Exception as e:
        print(f"Error fetching stock price from MarketStack for {symbol}: {e}")
        return None


@app.get("/stock-marketstack/{symbol}")
def get_stock_price_marketstack(symbol: str):
    """
    Get stock price from MarketStack API.
    
    Args:
        symbol: Stock ticker symbol
        
    Returns:
        JSON with stock data
    """
    stock_data = get_stock_price_from_marketstack(symbol)
    
    if stock_data is None:
        return {
            "symbol": symbol.upper(),
            "price": None,
            "status": "error",
            "message": "Could not retrieve stock price from MarketStack"
        }
    
    return {
        "symbol": symbol.upper(),
        "price": stock_data['price'],
        "open": stock_data['open'],
        "high": stock_data['high'],
        "low": stock_data['low'],
        "volume": stock_data['volume'],
        "date": stock_data['date'],
        "status": "success"
    }
