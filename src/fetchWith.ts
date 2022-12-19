
import { log } from './log'

export type FetchOpts = {
  body?: string,
  method?: string
}

export type WorkerParam = {url: string, opts?: FetchOpts, stream?: ReadableStream}

const makeWorkerPromise = (worker: Worker, { url, opts, stream }: WorkerParam) => new Promise((resolve, reject) => {
  const uuid = crypto.randomUUID()

  if(Boolean(stream))
    worker.postMessage([uuid, url, opts, stream!], [stream!] )
  else 
    worker.postMessage([uuid, url, opts])
  
  const listener = (e) => { 
    const requestUUID = e.data[0];
    const response = e.data[1] || {};

    if(requestUUID !== uuid) return // guard
    
    if(response.error){
      reject(response.error)
    }else {
      resolve(response)
    }
    log(`message handler removed for request ${uuid}.`)
    worker.removeEventListener('message', listener)
  }
  worker.addEventListener('message', listener);  
  log(`message handler added for ${uuid}.`)
})

export function fetchWith(worker: Worker) {
  return function get(url: string, opts?: FetchOpts) {
    return makeWorkerPromise(worker, { url, opts })
  }
}

export function uploadWith(worker: Worker) {
  return function upload(url: string, fileBlob: Blob, opts?: FetchOpts) {
      return makeWorkerPromise(worker, {
        url, 
        opts: {...opts, method: 'POST'},
        stream: fileBlob.stream()
      })
  }
}
