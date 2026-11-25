"""Check actual local resource/anchor integrity in the buildless site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import sys
root=Path(__file__).resolve().parent.parent
class Parser(HTMLParser):
    def __init__(self,text):
        super().__init__();self.ids=set();self.links=[];self.errors=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        values=dict(attrs)
        if values.get('id'):
            if values['id'] in self.ids:self.errors.append('duplicate ID '+values['id'])
            self.ids.add(values['id'])
        for attr in ['src','href']:
            if values.get(attr):self.links.append(values[attr])
pages={p:Parser(p.read_text(encoding='utf-8')) for p in root.glob('*.html')}
errors=[];checked=0
for page,parsed in pages.items():
    errors.extend(f'{page.name}: {error}' for error in parsed.errors)
    for link in parsed.links:
        url=urlsplit(link)
        if url.scheme or url.netloc:continue
        if link=='#':errors.append(f'{page.name}: placeholder link');continue
        target=(page.parent/unquote(url.path)).resolve() if url.path else page
        if target.is_dir():target=target/'index.html'
        checked+=1
        if not target.is_file():errors.append(f'{page.name}: missing {link}')
        elif url.fragment and target in pages and url.fragment not in pages[target].ids:errors.append(f'{page.name}: missing anchor {link}')
print(f'{len(pages)} HTML pages; {checked} local references; {len(errors)} errors')
for error in errors:print(error)
sys.exit(bool(errors))
