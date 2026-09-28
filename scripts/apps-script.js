function doPost(e){
  try{
    const data = JSON.parse(e.postData.contents);
    const ss = data.sheetId ? SpreadsheetApp.openById(data.sheetId) : SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    if(sheet.getLastRow() === 0){
      sheet.appendRow(["Title","URL","Label","Tag","Date","Favorite","ID","Favicon"]);
    }
    
    function rowFromItem(r){
      const title = r.title || "";
      const url = r.url || "";
      const label = r.collection || r.label || "General";
      const tag = Array.isArray(r.tags) ? r.tags.join(",") : (r.tag || r.tags || "other");
      const date = r.createdAt || new Date().toISOString();
      const fav = r.favorite === true || r.favorite === "TRUE";
      const id = r.id || ("link-" + new Date().getTime());
      const favicon = r.faviconUrl || r.favicon || "";
      return [title, url, label, tag, date, fav, id, favicon];
    }

    if(data.action === "add"){
      sheet.appendRow(rowFromItem(data.data));
    } else if(data.action === "edit"){
      const r = data.data;
      const rows = sheet.getDataRange().getValues();
      let found = false;
      for(let i = 1; i < rows.length; i++){
        if(String(rows[i][6]) === String(r.id)){
          const updatedRow = rowFromItem(r);
          sheet.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
          found = true;
          break;
        }
      }
      if(!found){
        sheet.appendRow(rowFromItem(r));
      }
    } else if(data.action === "delete"){
      const rows = sheet.getDataRange().getValues();
      for(let i = rows.length - 1; i >= 1; i--){
        if(String(rows[i][6]) === String(data.data.id)){
          sheet.deleteRow(i + 1);
          break;
        }
      }
    } else if(data.action === "pushAll"){
      sheet.clear();
      sheet.appendRow(["Title","URL","Label","Tag","Date","Favorite","ID","Favicon"]);
      const batch = (data.data || []).map(rowFromItem);
      if(batch.length > 0){
        sheet.getRange(2, 1, batch.length, 8).setValues(batch);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e){
  try{
    const ss = (e && e.parameter && e.parameter.sheetId) ? SpreadsheetApp.openById(e.parameter.sheetId) : SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    const rows = sheet.getDataRange().getValues();
    const out = [];
    for(let i = 1; i < rows.length; i++){
      const r = rows[i];
      if(!r[1]) continue;
      out.push({
        title: r[0],
        url: r[1],
        label: r[2],
        collection: r[2],
        tag: r[3],
        tags: (r[3] ? String(r[3]).split(",").filter(Boolean) : []),
        createdAt: r[4],
        favorite: r[5] === true || r[5] === "TRUE",
        id: r[6],
        favicon: r[7],
        faviconUrl: r[7]
      });
    }
    return ContentService.createTextOutput(JSON.stringify({success: true, data: out})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
