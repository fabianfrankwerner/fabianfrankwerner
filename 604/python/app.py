from flask import Flask, render_template, request
import requests
import pandas as pd
from collections import Counter
from datetime import datetime

app = Flask(__name__)

# OPTIONAL: Add your GitHub Token here to avoid rate limits (60 req/hr)
GITHUB_TOKEN = "" 
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}

def get_commits(user, repo):
    """Fetches the last 100 commits from a repo."""
    url = f"https://api.github.com/repos/{user}/{repo}/commits?per_page=100"
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []

def analyze_data(commits):
    """Uses Pandas to crunch the numbers."""
    if not commits:
        return None

    # 1. Load into DataFrame
    data = []
    for c in commits:
        commit_info = c['commit']
        data.append({
            'author': commit_info['author']['name'],
            'date': commit_info['author']['date'],
            'message': commit_info['message']
        })
    
    df = pd.DataFrame(data)  # Create DataFrame directly from list of dicts

    # 2. Convert date to datetime objects
    df['date'] = pd.to_datetime(df['date'])

    # 3. Analysis Logic
    
    # Top Authors
    top_authors = df['author'].value_counts().head(5).to_dict()

    # Busiest Days (0=Monday, 6=Sunday)
    df['day_name'] = df['date'].dt.day_name()
    busiest_days = df['day_name'].value_counts().to_dict()

    # Activity Timeline (Date only)
    df['date_only'] = df['date'].dt.date.astype(str)
    timeline = df['date_only'].value_counts().sort_index().to_dict()

    return {
        "top_authors": top_authors,
        "busiest_days": busiest_days,
        "timeline": timeline,
        "total_commits": len(df)
    }

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user = request.form.get('user')
        repo = request.form.get('repo')
        
        raw_commits = get_commits(user, repo)
        stats = analyze_data(raw_commits)
        
        if stats:
            return render_template('dashboard.html', user=user, repo=repo, stats=stats)
        else:
            return render_template('index.html', error="Could not find repository or empty history.")
            
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)