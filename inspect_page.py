import urllib.request
import re

url = "https://cafe-pulse-insight-hub.lovable.app/login"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

print("--- HTML LENGTH ---", len(html))
scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', html)
print("SCRIPTS:", scripts)
links = re.findall(r'<link[^>]*href=["\']([^"\']+)["\']', html)
print("LINKS:", links)
