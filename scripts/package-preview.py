"""Package only the runtime site, excluding Git, tests, docs and test fixtures."""
from pathlib import Path
import hashlib,json,subprocess,zipfile
root=Path(__file__).resolve().parent.parent
output=root.parent/'output'/'stylemix'
output.mkdir(parents=True,exist_ok=True)
files=sorted([*root.glob('*.html'),*[p for p in (root/'assets').rglob('*') if p.is_file()]])
manifest={
    'branch':'feat/wardrobe-outfit-suggestions',
    'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),
    'files':{p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files},
    'production_changed':False,
}
archive=output/'stylemix-preview-20261125.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as bundle:
    for p in files:bundle.write(p,p.relative_to(root).as_posix())
    bundle.writestr('README-PREVIEW.txt','StyleMix preview. Extract the zip, run python -m http.server 8000 in the extracted folder, then open http://localhost:8000/. Use an HTTP server, not file://. Production is unchanged. Confirm the rights to legacy external photos before public release.')
with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    assert 'index.html' in bundle.namelist()
    assert len(bundle.namelist())==len(files)+1
(output/'release-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'archive':str(archive),'runtime_files':len(files),'commit':manifest['commit'],'archive_sha256':hashlib.sha256(archive.read_bytes()).hexdigest()},ensure_ascii=False))
