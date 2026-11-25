(function () {
  'use strict';
  const core=window.StyleMixAdmin;
  const $=id=>document.getElementById(id);
  const form=$('photoForm'), fileInput=$('photoFile'), category=$('category'), color=$('color'), type=$('garmentType');
  let file=null, previewUrl=null, modelPromise=null, busy=false, generation=0;
  let libraryPhotos=[], loadingPhoto=false;
  let reviewed=[];
  const status=message=>{ $('adminStatus').textContent=message; };
  function options(select, entries) {
    select.replaceChildren(...entries.map(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;return option;}));
  }
  function nextId() { $('recordId').value='photo-'+(typeof crypto.randomUUID==='function' ? crypto.randomUUID() : Date.now()+'-'+Math.random().toString(16).slice(2)); }
  function invalidate() { $('approved').checked=false; }
  function groupChanged() {
    options(type,Object.entries(core.taxonomy[category.value].types).map(([value,labels])=>[value,labels[0]]));
    $('candidates').replaceChildren();
    $('modelStatus').textContent='Gợi ý chỉ áp dụng cho nhóm '+core.taxonomy[category.value].label.toLowerCase()+'. Có thể chọn tay.';
    invalidate();
  }
  function releasePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl=null;file=null;
    $('photoPreview').removeAttribute('src');$('photoPreview').hidden=true;$('previewEmpty').hidden=false;
    $('analyzePhoto').disabled=true;
  }
  function syncPhotoControls() {
    fileInput.disabled=busy || loadingPhoto;
    $('libraryPhoto').disabled=busy || loadingPhoto || !libraryPhotos.length;
    $('openLibraryPhoto').disabled=busy || loadingPhoto || !libraryPhotos.length;
    $('analyzePhoto').disabled=busy || loadingPhoto || !file;
  }
  function beginPhoto() {
    const token=++generation;
    releasePreview();$('sourceUrl').value='';$('recordName').value='';invalidate();$('fullBodyConfirmed').checked=false;$('candidates').replaceChildren();
    return token;
  }
  options(category,Object.entries(core.taxonomy).map(([value,group])=>[value,group.label]));
  options(color,Object.entries(core.colors).map(([value,labels])=>[value,labels[0]]));
  groupChanged();nextId();
  category.addEventListener('change',groupChanged);
  for (const id of ['color','garmentType','sourceUrl','recordId','recordName','fullBodyConfirmed']) $(id).addEventListener('input',invalidate);
  async function openPhoto(selected,token) {
    if (!selected) return;
    const errors=core.validateFile(selected);
    if (errors.length) {status(errors.join(' '));fileInput.value='';return;}
    const url=URL.createObjectURL(selected);
    try {
      const image=new Image();image.src=url;await image.decode();
      if (token!==generation) {URL.revokeObjectURL(url);return;}
      if (image.naturalWidth*image.naturalHeight>32000000) throw new Error('Ảnh vượt 32 megapixel; hãy giảm kích thước trên máy.');
      file=selected;previewUrl=url;$('photoPreview').src=url;$('photoPreview').hidden=false;$('previewEmpty').hidden=true;
      syncPhotoControls();
      status('Đã mở '+selected.name+'. Hãy đối chiếu nguồn và duyệt món cần phân loại.');
      return true;
    } catch(error) {
      URL.revokeObjectURL(url);
      if (token!==generation) return;
      fileInput.value='';status(error.message.includes('32 megapixel') ? error.message : 'Trình duyệt không đọc được ảnh. Hãy chuyển thành JPEG/PNG/WebP hợp lệ trên máy rồi chọn lại; sau đó có thể nhập nhãn tay.');
    }
  }
  fileInput.addEventListener('change',()=>openPhoto(fileInput.files[0],beginPhoto()));
  async function loadLibrary() {
    try {
      const response=await fetch('./assets/data/photo-library.json',{mode:'same-origin',redirect:'error'});
      if (!response.ok) throw new Error('HTTP '+response.status);
      const rows=await response.json();
      if (!Array.isArray(rows)) throw new Error('Danh sách không hợp lệ.');
      libraryPhotos=rows.flatMap(row=>{try {return [core.resolveLibraryPhoto(row,location.href)];} catch {return [];}});
      if (!libraryPhotos.length) throw new Error('Chưa có ảnh thư viện hợp lệ.');
      options($('libraryPhoto'),libraryPhotos.map((photo,index)=>[String(index),photo.id+' · '+photo.filename]));
      $('libraryStatus').textContent='Chọn ảnh rồi nhấn Mở ảnh thư viện. Vẫn cần tự kiểm tra và duyệt nhãn.';
    } catch(error) {
      options($('libraryPhoto'),[['','Không tải được danh sách']]);
      $('libraryStatus').textContent='Không tải được thư viện. Tải lại trang để thử lại hoặc chọn ảnh trên máy. '+error.message;
    } finally {syncPhotoControls();}
  }
  $('openLibraryPhoto').addEventListener('click',async()=>{
    if (busy || loadingPhoto) return;
    const photo=libraryPhotos[Number($('libraryPhoto').value)];
    if (!photo) return;
    const token=beginPhoto();loadingPhoto=true;syncPhotoControls();fileInput.value='';
    $('libraryStatus').textContent='Đang mở '+photo.filename+'…';
    try {
      const response=await fetch(photo.url,{mode:'same-origin',redirect:'error'});
      if (!response.ok) throw new Error('HTTP '+response.status);
      const blob=await response.blob();
      if (token!==generation) return;
      const selected=new File([blob],photo.filename,{type:blob.type});
      if (await openPhoto(selected,token)) {
        $('sourceUrl').value=photo.sourceUrl;
        $('libraryStatus').textContent='Đã mở '+photo.filename+' và điền link nguồn. Chưa duyệt nhãn hoặc ảnh toàn thân.';
      } else $('libraryStatus').textContent='Ảnh thư viện không đọc được; hãy chọn ảnh khác hoặc ảnh trên máy.';
    } catch(error) {
      if (token===generation) $('libraryStatus').textContent='Không mở được ảnh. Thử lại hoặc chọn ảnh trên máy. '+error.message;
    } finally {loadingPhoto=false;syncPhotoControls();}
  });
  loadLibrary();
  async function getModel() {
    if (!modelPromise) {
      // Official v3.8.1 pipeline and dtype API: https://huggingface.co/docs/transformers.js/v3.8.1/api/pipelines
      modelPromise=(async()=>{
        const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js');
        env.allowLocalModels=false;
        env.backends.onnx.wasm.numThreads=1;
        return pipeline('zero-shot-image-classification','Xenova/clip-vit-base-patch32',{
          device:'wasm',dtype:'q8',
          progress_callback:progress=>{
            if (progress.status==='progress' && Number.isFinite(progress.progress)) $('modelStatus').textContent='Đang tải mô hình: '+Math.round(progress.progress)+'% của '+(progress.file || 'tệp')+'. Ảnh vẫn ở trên máy.';
          }
        });
      })().catch(error=>{modelPromise=null;throw error;});
    }
    return modelPromise;
  }
  $('analyzePhoto').addEventListener('click',async()=>{
    if (!file || busy) return;
    const token=generation, group=category.value, url=previewUrl;
    busy=true;syncPhotoControls();category.disabled=true;$('candidates').replaceChildren();
    $('modelStatus').textContent='Đang chuẩn bị CLIP trên máy; lần đầu cần tải mô hình. Có thể tiếp tục nhập nhãn tay.';
    try {
      const classifier=await getModel();
      if (token!==generation) return;
      $('modelStatus').textContent='Đang so sánh loại và màu trong nhóm đã chọn…';
      const output=await classifier(url,core.candidatesFor(group).map(candidate=>candidate.label));
      if (token!==generation) return;
      const candidates=core.mapCandidates(output,group);
      if (!candidates.length) throw new Error('Không có nhãn phù hợp.');
      for (const candidate of candidates) {
        const li=document.createElement('li'), button=document.createElement('button');button.type='button';
        button.textContent=candidate.typeName+' · '+candidate.colorName+' — điểm tương đồng '+candidate.score.toFixed(3)+' · Chọn';
        button.addEventListener('click',()=>{type.value=candidate.type;color.value=candidate.color;invalidate();status('Đã chọn gợi ý. Kiểm tra lại và tích duyệt nhãn trước khi thêm.');});
        li.append(button);$('candidates').append(li);
      }
      $('modelStatus').textContent='Chọn một gợi ý hoặc sửa bằng tay. Nhãn chưa được duyệt; điểm không phải độ tin cậy đã hiệu chuẩn.';
    } catch(error) {
      if (token===generation) $('modelStatus').textContent='Không phân tích được (mạng, bộ nhớ hoặc trình duyệt không hỗ trợ). Nhấn Phân tích để thử lại, hoặc chọn loại/màu bằng tay. '+String(error.message || '').slice(0,180);
    } finally {
      busy=false;category.disabled=false;syncPhotoControls();
    }
  });
  function renderReview() {
    $('reviewCount').textContent=String(reviewed.length);$('exportJson').disabled=!reviewed.length;
    $('reviewList').replaceChildren(...reviewed.map(record=>{
      const li=document.createElement('li'), info=document.createElement('div'), title=document.createElement('strong'), details=document.createElement('p'), source=document.createElement('a'), remove=document.createElement('button');
      title.textContent=record.name;
      details.textContent=record.id+' · '+core.taxonomy[record.category].label+' / '+core.colors[record.color][0]+' / '+core.taxonomy[record.category].types[record.type][0]+' · '+record.image;
      source.href=record.sourceUrl;source.target='_blank';source.rel='noopener noreferrer';source.textContent='Xem Pin nguồn';
      remove.type='button';remove.className='admin-button admin-button-secondary';remove.textContent='Bỏ';remove.setAttribute('aria-label','Bỏ bản ghi '+record.name);
      remove.addEventListener('click',()=>{reviewed=reviewed.filter(item=>item.id!==record.id);renderReview();status('Đã bỏ bản ghi khỏi danh sách xuất.');});
      info.append(title,details,source);li.append(info,remove);return li;
    }));
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if (!file) {status('Chọn một ảnh hợp lệ trước khi duyệt.');return;}
    const record={id:$('recordId').value.trim(),sourceUrl:$('sourceUrl').value.trim(),category:category.value,type:type.value,color:color.value,name:$('recordName').value.trim(),approved:$('approved').checked,fullBodyConfirmed:$('fullBodyConfirmed').checked,image:file.name};
    const errors=core.validateRecord(record);
    if (reviewed.some(item=>item.id===record.id)) errors.push('ID đã được thêm. Dùng ID khác hoặc bỏ bản ghi cũ.');
    if (errors.length) {status(errors.join(' '));return;}
    reviewed.push(record);renderReview();nextId();invalidate();
    status('Đã thêm bản ghi đã duyệt. Có thể chọn món khác trong cùng ảnh hoặc mở ảnh tiếp theo. Xuất JSON trước khi đóng trang.');
  });
  $('exportJson').addEventListener('click',()=>{
    try {
      const data=core.exportRecords(reviewed), url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download='stylemix-reviewed-photos.json';document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      status('Đã xuất JSON. File ảnh chưa được sao chép hay xuất bản: bàn giao ảnh gốc và JSON cho người duy trì áp dụng vào dự án.');
    } catch(error) {status(error.message);}
  });
  $('clearSession').addEventListener('click',()=>{
    generation++;releasePreview();reviewed=[];form.reset();groupChanged();nextId();renderReview();status('Đã xoá ảnh và bản ghi khỏi phiên này. Các file đã tải xuống vẫn nằm trên máy.');
  });
  window.addEventListener('pagehide',()=>{generation++;releasePreview();});
})();
