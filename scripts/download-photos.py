"""Download explicitly selected, UI-observed Pinterest image URLs."""
from pathlib import Path
from urllib.request import Request,urlopen
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import json,hashlib
root=Path(__file__).resolve().parent.parent
rows=[
('black-trousers','661325526579466558','81/0a/3d/810a3d54893901e2ffc0a4e92bbde0bd','pants','black'),
('black-jeans-hoodie','1131036893952756050','48/e6/ef/48e6ef6a203a24b31c2693994f182d18','pants','black'),
('blue-jeans-green-tee','915497430526409091','47/8c/8a/478c8a6466defe487285177775a60ba5','pants','blue'),
('blue-jeans-white-shirt','1084241679075528265','98/56/db/9856db036ce549128f3c031dddc2d2b7','pants','blue'),
('beige-trousers-brown-jacket','1130122100274089024','70/97/7c/70977cc387d0bfe581b158ce4a1ba6f5','pants','beige'),
('beige-trousers-vest','1089167491167358065','2f/ba/3c/2fba3c68725f09785616c3b2ecb46387','pants','beige'),
('gray-trousers-black-tee','706642997874745107','56/fe/03/56fe038091498706be7990a5c091a150','pants','gray'),
('gray-trousers-blazer','1125055550701020154','64/c6/19/64c6199cc399425ed4fe66d6e61bd7da','pants','gray'),
('white-tee-blue-jeans','1135118281119740169','e5/df/d8/e5dfd843803adb3824672fe9c072a604','tops','white'),
('white-shirt-black-trousers','359513982770774871','c9/3e/af/c93eaf6a778cb865184534316bb1563a','tops','white'),
('white-hoodie-blue-jeans','4593812441569827904','e3/78/73/e37873719e2d6627c71d124c15045f01','outerwear','white'),
('blue-denim-jacket','1084171310331580352','87/d2/fc/87d2fc18cb06ed69210bb168b000cd58','outerwear','blue'),
]
destination=root/'assets/photos';destination.mkdir(exist_ok=True)
metadata=root/'assets/data/photo-library.json'
previous={p['id']:p for p in json.loads(metadata.read_text(encoding='utf-8'))} if metadata.exists() else {}
def download(row):
    id,pin,img,category,color=row
    resolution='474x' if id=='blue-jeans-white-shirt' else '736x'
    url=f'https://i.pinimg.com/{resolution}/{img}.jpg'
    target=destination/f'{id}.jpg'
    if not target.exists():
        request=Request(url,headers={'User-Agent':'Mozilla/5.0','Referer':f'https://www.pinterest.com/pin/{pin}/'})
        with urlopen(request,timeout=45) as response:
            if not response.headers.get('Content-Type','').startswith('image/'):raise ValueError('Not an image')
            data=response.read(10_000_001)
        if len(data)>10_000_000 or len(data)<1000:raise ValueError('Invalid image size')
        target.write_bytes(data)
    digest=hashlib.sha256(target.read_bytes()).hexdigest()
    old=previous.get(id,{})
    unchanged=old.get('sha256')==digest and old.get('imageUrl')==url
    return dict(id=id,image=f'./assets/photos/{id}.jpg',sourceUrl=f'https://www.pinterest.com/pin/{pin}/',imageUrl=url,requestedCategory=category,requestedColor=color,fullBodyReviewed=bool(unchanged and old.get('fullBodyReviewed')),labelsReviewed=bool(unchanged and old.get('labelsReviewed')),reviewedSha256=digest if unchanged and old.get('fullBodyReviewed') and old.get('labelsReviewed') else None,rightsStatus='Source linked; ownership and license not asserted',retrievedAt=old['retrievedAt'] if unchanged else datetime.now(timezone.utc).isoformat(),sha256=digest)
with ThreadPoolExecutor(max_workers=4) as pool:
    records=list(pool.map(download,rows))
(root/'assets/data/photo-library.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'downloaded':len(records),'bytes':sum((destination/f'{r[0]}.jpg').stat().st_size for r in rows)}))
