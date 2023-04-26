import requests
from datetime import datetime, timedelta

api_key = 'YOUR_API_KEY'  # Replace with your API key
query = 'haptics'
days_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')

url = f'https://newsapi.google.com/v1/search?q={query}&from={days_ago}&sortBy=publishedAt&key={api_key}'

response = requests.get(url)

if response.status_code == 200:
    articles = response.json()['articles']
    for article in articles:
        print(article['title'])
        print(article['description'])
        print(article['url'])
        print('-'*80)
else:
    print(f'Request failed with status code {response.status_code}')
