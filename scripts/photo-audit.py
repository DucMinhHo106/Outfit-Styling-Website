from pathlib import Path
import json,html
root=Path(__file__).resolve().parent.parent
rows=json.loads((root/'assets/data/photo-library.json').read_text(encoding='utf-8'))
css='body{background:#111;color:white;font:13px Arial;margin:12px}.grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}figure{margin:0}img{width:100%;height:300px;object-fit:contain;background:#222}figcaption{min-height:34px}'
cards=''.join(f'<figure><img src="../{r["image"][2:]}"><figcaption>{i+1}. {html.escape(r["id"])}</figcaption></figure>' for i,r in enumerate(rows))
(root/'docs/photo-audit.html').write_text('<!doctype html><html lang="vi"><meta charset="utf-8"><title>StyleMIX Photo Audit</title><style>'+css+'</style><div class="grid">'+cards+'</div></html>',encoding='utf-8')
