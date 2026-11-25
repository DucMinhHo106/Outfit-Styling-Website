"""Build reviewed apparel catalogs from the photographed outfit inventory."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parent.parent
photos=json.loads((root/'assets/data/photo-library.json').read_text(encoding='utf-8'))
by_photo={p['id']:p for p in photos}
# Labels were reviewed against complete downloaded photos, not inferred from filenames.
sets=[
('black-trousers','Áo thun đen và quần vải đen',['tee-black','trousers-black'],['school','work','social']),
('black-jeans-hoodie','Hoodie đen và jeans đen',['tee-white','jeans-black','hoodie-black'],['school','social']),
('blue-jeans-green-tee','Áo thun xanh lá và jeans xanh',['tee-green','jeans-blue'],['school','social']),
('blue-jeans-white-shirt','Sơ mi trắng và jeans xanh',['shirt-white','jeans-blue'],['school','work','social']),
('beige-trousers-brown-jacket','Áo khoác nâu và quần vải be',['shirt-black','trousers-beige','jacket-brown'],['school','work','social']),
('beige-trousers-vest','Sơ mi trắng, gile be và quần be',['shirt-white','trousers-beige','vest-beige'],['school','work','presentation']),
('gray-trousers-black-tee','Áo thun đen và quần vải xám',['tee-black','trousers-gray'],['school','work','social']),
('gray-trousers-blazer','Sơ mi khoác xám và quần vải xám',['inner-white','trousers-gray','overshirt-gray'],['work','presentation','social']),
('white-tee-blue-jeans','Áo thun trắng và jeans xanh',['tee-white','jeans-blue'],['school','social']),
('white-shirt-black-trousers','Sơ mi trắng và quần vải đen',['shirt-white','trousers-black'],['school','work','presentation']),
('white-hoodie-blue-jeans','Hoodie trắng và jeans xanh',['hoodie-white','jeans-blue'],['school','social']),
('blue-denim-jacket','Áo khoác jeans xanh cùng áo thun trắng',['tee-white','jeans-blue','denim-jacket-blue'],['school','social'])]
definitions=[
('trousers-black','Quần vải đen','pants','trousers','black','#303034','black-trousers'),
('jeans-black','Quần jeans đen','pants','jeans','black','#343438','black-jeans-hoodie'),
('jeans-blue','Quần jeans xanh biển','pants','jeans','blue','#6484a1','blue-jeans-green-tee'),
('trousers-beige','Quần vải be','pants','trousers','beige','#c4ae8b','beige-trousers-brown-jacket'),
('trousers-gray','Quần vải xám','pants','trousers','gray','#96969c','gray-trousers-black-tee'),
('tee-black','Áo thun đen','tops','tee','black','#303034','black-trousers'),
('tee-white','Áo thun trắng','tops','tee','white','#f0ece5','white-tee-blue-jeans'),
('tee-green','Áo thun xanh lá','tops','tee','green','#245547','blue-jeans-green-tee'),
('shirt-white','Áo sơ mi trắng','tops','shirt','white','#f0ece5','white-shirt-black-trousers'),
('shirt-black','Áo sơ mi đen','tops','shirt','black','#303034','beige-trousers-brown-jacket'),
('inner-white','Áo mặc trong trắng','tops','inner_top','white','#f0ece5','gray-trousers-blazer'),
('hoodie-black','Áo khoác hoodie đen','outerwear','hoodie','black','#303034','black-jeans-hoodie'),
('hoodie-white','Áo hoodie trắng','outerwear','hoodie','white','#f0ece5','white-hoodie-blue-jeans'),
('denim-jacket-blue','Áo khoác jeans xanh','outerwear','denim_jacket','blue','#6484a1','blue-denim-jacket'),
('jacket-brown','Áo khoác nâu','outerwear','jacket','brown','#6d4d35','beige-trousers-brown-jacket'),
('vest-beige','Áo gile be','outerwear','vest','beige','#c4ae8b','beige-trousers-vest'),
('overshirt-gray','Áo sơ mi khoác xám','outerwear','overshirt','gray','#96969c','gray-trousers-blazer')]
labels={'jeans':'Quần jeans','trousers':'Quần vải','tee':'Áo thun','shirt':'Sơ mi','inner_top':'Áo mặc trong','hoodie':'Hoodie','denim_jacket':'Áo khoác jeans','jacket':'Áo khoác','vest':'Gile','blazer':'Blazer','overshirt':'Sơ mi khoác'}
items=[]
for id,name,category,type,color,hex,photo_id in definitions:
    p=by_photo[photo_id]
    items.append(dict(id=id,name=name,category=category,type=type,color=color,hex=hex,image=p['image'],img=p['image'],sourceUrl=p['sourceUrl'],tag=labels[type],desc=f'Ảnh outfit thật có {name.lower()}. Chọn món theo loại và màu bạn đang có; không cần đúng thương hiệu trong ảnh.',items=[name,'Ảnh toàn thân để nhìn tổng thể phối đồ','Màu có thể khác nhẹ theo ánh sáng; chất liệu chưa xác minh']))
item_map={item['id']:item for item in items}
templates=[]
for order,(photo_id,title,item_ids,occasions) in enumerate(sets):
    photo=by_photo[photo_id];slots=[]
    for id in item_ids:
        item=item_map[id];slot={'pants':'bottom','tops':'top','outerwear':'outerwear'}[item['category']]
        substitutes=[]
        if id=='jeans-blue' and ('school' in occasions or 'social' in occasions):substitutes=['jeans-black']
        if id=='tee-white':substitutes=['tee-black']
        slots.append(dict(id=slot,acceptedItemIds=[id],substituteItemIds=substitutes))
    instructions=['Ảnh cho thấy toàn bộ outfit. Đối chiếu loại và màu từng món với tủ đồ; không cần mua đúng sản phẩm hoặc thương hiệu trong ảnh.']
    if any(item_map[id]['type']=='shirt' for id in item_ids):instructions.append('Sơ vin gọn nếu muốn chỉn chu; có thể thả áo khi phù hợp với phom quần và hoàn cảnh.')
    if 'school' in occasions:instructions.append('Đi học: chỉ áp dụng vào ngày trường cho mặc tự do; ưu tiên quy định đồng phục của trường.')
    if 'work' in occasions:instructions.append('Đi làm: kiểm tra quy định công sở; áo thun, jeans hoặc sneaker chỉ phù hợp nơi cho ăn mặc thoải mái.')
    if 'presentation' in occasions:instructions.append('Thuyết trình hoặc phỏng vấn: ưu tiên trang phục phẳng, vừa vặn và phù hợp mức trang trọng của buổi gặp.')
    instructions.append('Giày và phụ kiện trong ảnh chỉ giúp hình dung tổng thể; không phải điều kiện lọc hoặc món bắt buộc trong ứng dụng.')
    templates.append(dict(id='photo-'+photo_id,title=title,name=title,occasions=occasions,image=photo['image'],img=photo['image'],imageSource=photo['sourceUrl'],sourceUrl=photo['sourceUrl'],fullBodyReviewed=True,requiredSlots=slots,optionalItems=[],instructions=instructions,editorialOrder=order,tag='Phối đồ cơ bản',color=list(dict.fromkeys(item_map[id]['color'] for id in item_ids)),desc='Outfit toàn thân được tuyển chọn từ Pinterest. Nhãn màu và loại đồ đã đối chiếu với ảnh; nguồn ảnh ở phần chi tiết.',items=[item_map[id]['name'] for id in item_ids]))
def write(name,data):
    (root/'assets/data'/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
write('item-catalog.json',items);write('outfit-templates.json',templates)
for category,name in [('pants','quan'),('tops','ao'),('outerwear','ao-khoac')]:write(name+'.json',[item for item in items if item['category']==category])
# Keep the original home layout; replace legacy photos and data with current reviewed outfits.
p=root/'assets/js/home.js';s=p.read_text(encoding='utf-8')
start=s.index('const OUTFITS =');end=s.index('/* ── Style Modal Data',start)
s=s[:start]+'const OUTFITS = '+json.dumps(templates,ensure_ascii=False,indent=2)+';\n\n'+s[end:]
start=s.index('window.STYLE_DATA =');end=s.index('/* ── Render & Filter',start)
style_photos={'streetwear':templates[1],'minimal':templates[9],'vintage':templates[4],'sporty':templates[10]}
style_data={key:dict(title=t['title'],tag=t['tag'],img=t['img'],desc=t['desc'],items=t['items'],sourceUrl=t['sourceUrl']) for key,t in style_photos.items()}
s=s[:start]+'window.STYLE_DATA = '+json.dumps(style_data,ensure_ascii=False,indent=2)+';\n\n'+s[end:]
p.write_text(s,encoding='utf-8',newline='\n')
print(json.dumps({'photos':len(photos),'catalogItems':len(items),'outfits':len(templates)}))
