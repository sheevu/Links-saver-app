
export type GSheetConfig = { webAppUrl: string; sheetId: string; sheetName: string; connected: boolean }

export async function pushToSheet(config: GSheetConfig, action: string, data: any){
  if(!config.webAppUrl) throw new Error('No Web App URL')
  const res = await fetch(config.webAppUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data, sheetId: config.sheetId })
  })
  return true
}

export async function pullFromSheet(config: GSheetConfig){
  if(!config.webAppUrl) throw new Error('No Web App URL')
  const url = `${config.webAppUrl}?sheetId=${config.sheetId}`
  const res = await fetch(url)
  const json = await res.json()
  return json.data
}

export const DEFAULT_SHEET_ID = '1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE'
export const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1h9dlyn8bzdIr9sq_TGfrarMMZVvSPPZ49zhxAGYM-JE/edit'
