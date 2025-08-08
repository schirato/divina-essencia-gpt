export async function idbSet(dbName:string, store:string, key:string, value:any){
  const db = await open(dbName, store)
  const tx = db.transaction(store, 'readwrite')
  tx.objectStore(store).put(value, key)
  await done(tx)
}
export async function idbGet(dbName:string, store:string, key:string){
  const db = await open(dbName, store)
  const tx = db.transaction(store, 'readonly')
  const req = tx.objectStore(store).get(key)
  const val = await promisify(req)
  await done(tx)
  return val
}
export async function idbAll(dbName:string, store:string){
  const db = await open(dbName, store)
  const tx = db.transaction(store, 'readonly')
  const req = tx.objectStore(store).getAll()
  const val = await promisify(req)
  await done(tx)
  return val
}

function open(dbName:string, store:string): Promise<IDBDatabase>{
  return new Promise((resolve, reject)=>{
    const req = indexedDB.open(dbName, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if(!db.objectStoreNames.contains(store)) db.createObjectStore(store)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}
function promisify<T=any>(req: IDBRequest<T>){ return new Promise<T>((res,rej)=>{ req.onsuccess=()=>res(req.result as T); req.onerror=()=>rej(req.error) }) }
function done(tx: IDBTransaction){ return new Promise<void>((res,rej)=>{ tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error) }) }
