
function doPost(e){
  try{
    const data = JSON.parse(e.postData.contents);
    const ss = data.sheetId ? SpreadsheetApp.openById(data.sheetId) : SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    if(sheet.getLastRow()===0){ sheet.appendRow(["Title","URL","Label","Tag","Date","Favorite","ID","Favicon"]); }
    if(data.action==="add" || data.action==="edit"){
      const r = data.data; sheet.appendRow([r.title, r.url, r.collection, r.tags.join(","), r.createdAt, r.favorite, r.id, r.faviconUrl]);
    } else if(data.action==="delete"){
      const rows = sheet.getDataRange().getValues();
      for(let i=rows.length-1;i>=1;i--){ if(rows[i][6]===data.data.id){ sheet.deleteRow(i+1); break; } }
    } else if(data.action==="pushAll"){
      sheet.clear(); sheet.appendRow(["Title","URL","Label","Tag","Date","Favorite","ID","Favicon"]);
      data.data.forEach((r)=>{ sheet.appendRow([r.title, r.url, r.collection, r.tags.join(","), r.createdAt, r.favorite, r.id, r.faviconUrl]); });
    }
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){ return ContentService.createTextOutput(JSON.stringify({success:false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON); }
}
function doGet(e){
  try{
    const ss = e.parameter.sheetId ? SpreadsheetApp.openById(e.parameter.sheetId) : SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0]; const rows = sheet.getDataRange().getValues(); const out = [];
    for(let i=1;i<rows.length;i++){ const r = rows[i]; out.push({title:r[0], url:r[1], collection:r[2], tags:(r[3]||"").split(",").filter(Boolean), createdAt:r[4], favorite:r[5]===true||r[5]==="TRUE", id:r[6], faviconUrl:r[7]}); }
    return ContentService.createTextOutput(JSON.stringify({success:true, data:out})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){ return ContentService.createTextOutput(JSON.stringify({success:false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON); }
}
