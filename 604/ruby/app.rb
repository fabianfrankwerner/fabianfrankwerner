require 'sinatra'
require 'httparty'
require 'date'
require 'json'

# Configure Sinatra to serve static files from the 'static' directory
set :public_folder, 'static'

# OPTIONAL: Add your GitHub Token here
GITHUB_TOKEN = ""
HEADERS = GITHUB_TOKEN.empty? ? {} : { "Authorization" => "token #{GITHUB_TOKEN}" }

class GitHubFetcher
  include HTTParty
  base_uri 'https://api.github.com'

  def self.get_commits(user, repo)
    options = { headers: HEADERS.merge({ "User-Agent" => "Ruby-Analyzer" }) }
    get("/repos/#{user}/#{repo}/commits?per_page=100", options)
  end
end

def analyze_commits(commits)
  return nil unless commits.is_a?(Array) && !commits.empty?

  # Ruby's Enumerable Magic Pipeline
  
  # 1. Top Authors
  top_authors = commits
    .map { |c| c['commit']['author']['name'] }
    .group_by(&:itself)                        # Group by value
    .transform_values(&:count)                 # Count occurrences (Ruby 2.6 compatible)
    .sort_by { |_, count| -count }             # Sort Descending
    .take(5)                                   # Top 5
    .to_h

  # 2. Busiest Days
  busiest_days = commits
    .map { |c| Date.parse(c['commit']['author']['date']).strftime("%A") } # Get Day Name
    .group_by(&:itself)                        # Group by value
    .transform_values(&:count)                 # Count occurrences (Ruby 2.6 compatible)
    .sort_by { |_, count| -count }
    .to_h

  {
    top_authors: top_authors,
    busiest_days: busiest_days,
    total_commits: commits.length
  }
end

# Sinatra Routes
get '/' do
  erb :index
end

post '/analyze' do
  @user = params[:user]
  @repo = params[:repo]
  
  response = GitHubFetcher.get_commits(@user, @repo)
  
  if response.success?
    @stats = analyze_commits(JSON.parse(response.body))
    erb :dashboard
  else
    @error = "Could not find repository or rate limit exceeded."
    erb :index
  end
end