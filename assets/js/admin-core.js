(function (root) {
  'use strict';
  const taxonomy = {
    pants: {label:'Quần / chân váy',types:{jeans:['Quần jeans','jeans'],trousers:['Quần tây','tailored trousers'],chinos:['Quần chinos','chino pants'],joggers:['Quần jogger','jogger pants'],shorts:['Quần short','shorts'],skirt:['Chân váy','skirt']}},
    tops: {label:'Áo',types:{inner_top:['Áo mặc trong','inner top'],tee:['Áo thun','t-shirt'],shirt:['Áo sơ mi','button-up shirt'],polo:['Áo polo','polo shirt'],sweater:['Áo sweater','sweater'],longsleeve:['Áo dài tay','long sleeve shirt']}},
    outerwear: {label:'Áo khoác',types:{overshirt:['Áo sơ mi khoác','overshirt'],vest:['Áo gile','sleeveless vest'],hoodie:['Áo hoodie','hoodie'],cardigan:['Áo cardigan','cardigan'],blazer:['Áo blazer','blazer'],bomber:['Áo bomber','bomber jacket'],denim_jacket:['Áo khoác jeans','denim jacket'],jacket:['Áo khoác','jacket'],coat:['Áo măng tô','overcoat']}}
  };
  const colors = {black:['Đen','black'],white:['Trắng','white'],gray:['Xám','gray'],blue:['Xanh dương','blue'],navy:['Xanh navy','navy blue'],beige:['Be','beige'],brown:['Nâu','brown'],cream:['Kem','cream'],green:['Xanh lá','green'],red:['Đỏ','red'],pink:['Hồng','pink'],orange:['Cam','orange'],yellow:['Vàng','yellow'],purple:['Tím','purple']};
  const own = (object,key) => Object.prototype.hasOwnProperty.call(object,key);
  const safeFilename = value => typeof value === 'string' && value.length <= 180 && !/[\x00-\x1f<>:"/\\|?*]/.test(value) && !value.startsWith('.') && /\.(jpe?g|png|webp)$/i.test(value);
  function candidatesFor(category) {
    if (!own(taxonomy,category)) throw new Error('Nhóm không hợp lệ.');
    return Object.entries(colors).flatMap(([color,[colorName,colorEnglish]]) => Object.entries(taxonomy[category].types).map(([type,[typeName,typeEnglish]]) => ({category,type,color,typeName,colorName,typeEnglish,colorEnglish,label:`a person wearing ${colorEnglish} ${typeEnglish}`})));
  }
  function mapCandidates(results,category) {
    const known = new Map(candidatesFor(category).map(candidate => [candidate.label,candidate]));
    const seen = new Set();
    return (Array.isArray(results) ? results : []).filter(result => result && known.has(result.label) && Number.isFinite(result.score) && result.score >= 0 && result.score <= 1).sort((a,b)=>b.score-a.score).filter(result=> !seen.has(result.label) && seen.add(result.label)).slice(0,5).map(result=>({...known.get(result.label),score:result.score}));
  }
  function validSource(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password && !url.port && (url.hostname === 'pinterest.com' || url.hostname.endsWith('.pinterest.com')) && /^\/pin\/\d+\/?$/.test(url.pathname);
    } catch { return false; }
  }
  function validateFile(file) {
    const errors=[];
    if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type)) errors.push('Chỉ nhận JPEG, PNG hoặc WebP.');
    if (!file || !Number.isFinite(file.size) || file.size <= 0 || file.size > 12*1024*1024) errors.push('Ảnh phải lớn hơn 0 và không vượt 12 MiB.');
    if (!file || !safeFilename(file.name)) errors.push('Tên ảnh không hợp lệ; dùng tên JPEG, PNG hoặc WebP không chứa đường dẫn.');
    return errors;
  }
  function resolveLibraryPhoto(row,baseUrl) {
    if (!row || typeof row.image !== 'string' || !/^\.\/assets\/photos\/[a-zA-Z0-9_-]+\.(jpe?g|png|webp)$/i.test(row.image) || !validSource(row.sourceUrl) || typeof row.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(row.id)) throw new Error('Ảnh thư viện hoặc nguồn không hợp lệ.');
    const base=new URL(baseUrl), url=new URL(row.image,base);
    if (!['https:','http:'].includes(base.protocol) || url.origin!==base.origin) throw new Error('Chỉ mở ảnh cùng nguồn của trang.');
    return {id:row.id,url:url.href,filename:row.image.split('/').pop(),sourceUrl:row.sourceUrl};
  }
  function validateRecord(record) {
    if (!record || typeof record !== 'object') return ['Bản ghi không hợp lệ.'];
    const errors=[];
    if (typeof record.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(record.id)) errors.push('ID chỉ gồm chữ, số, gạch nối hoặc gạch dưới (tối đa 80 ký tự).');
    if (!validSource(record.sourceUrl)) errors.push('Cần link Pin HTTPS trên pinterest.com, ví dụ https://www.pinterest.com/pin/123/.');
    if (!own(taxonomy,record.category) || !own(taxonomy[record.category].types,record.type)) errors.push('Nhóm hoặc loại trang phục không hợp lệ.');
    if (!own(colors,record.color)) errors.push('Màu không hợp lệ.');
    if (typeof record.name !== 'string' || !record.name.trim() || record.name.length > 160 || /[\x00-\x1f]/.test(record.name)) errors.push('Tên mô tả cần từ 1 đến 160 ký tự.');
    if (!safeFilename(record.image)) errors.push('Cần tên file ảnh cục bộ hợp lệ.');
    if (record.approved !== true) errors.push('Cần duyệt nhãn trước khi xuất.');
    if (record.fullBodyConfirmed !== true) errors.push('Cần xác nhận ảnh toàn thân và nguồn Pin đã đối chiếu.');
    return errors;
  }
  function exportRecords(records) {
    if (!Array.isArray(records) || !records.length) throw new Error('Chưa có bản ghi đã duyệt.');
    const ids=new Set();
    const output=records.map(record=>{
      const errors=validateRecord(record);
      if (errors.length) throw new Error(errors.join(' '));
      if (ids.has(record.id)) throw new Error('Trùng ID bản ghi.');
      ids.add(record.id);
      return {id:record.id,sourceUrl:record.sourceUrl,category:record.category,type:record.type,color:record.color,name:record.name.trim(),approved:true,fullBodyConfirmed:true,image:record.image};
    });
    return {version:1,records:output};
  }
  root.StyleMixAdmin={taxonomy,colors,candidatesFor,mapCandidates,validateFile,validateRecord,exportRecords,resolveLibraryPhoto};
  if (typeof module !== 'undefined') module.exports=root.StyleMixAdmin;
})(typeof window !== 'undefined' ? window : globalThis);
