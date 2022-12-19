import { fetchWith, uploadWith } from './fetchWith'
import { log } from './log'

export type SetupOpts = {
  statusEl?: HTMLDivElement,
  worker: Worker
}

export type SetupOpts = {
  statusEl?: HTMLDivElement,
  worker: Worker,
  fileInputSelector: string
}

const username = 'alvin'
const password = '#secretAvocad0'

export function setupLoginRequest(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    worker
  } = opts
  
  element.addEventListener('click', () => {
    fetchWith(worker)('?login', { body: JSON.stringify({username, password}) }).then(res => {
      log(`Success = ${res}`, true)
    }).catch(err => {
      log(`Error = ${err}`, true)
    })
  })
}

export function setupSendAnAuthenticatedRequest(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    worker
  } = opts
  
  element.addEventListener('click', () => {
    fetchWith(worker)('/abc', {
      body: JSON.stringify({name: 'alvin'})
    }).then(res => {
      log(`Success = ${res}`, true)
    }).catch(err => {
      log(`Error = ${err}`, true)
    })
  })
}

export function setupUploadRequest(element: HTMLButtonElement, opts: SetupUploadOpts) {
  const {
    worker,
    fileInputSelector
  } = opts

  const fileInput = document.querySelector(fileInputSelector)
  const clickToBrowse = () => {
    fileInput.click()
  }
  const uploadFile = () => {
    uploadWith(worker)('/upload', fileInput.files[0]).then(res => {
      log(`Success = ${res}`, true)
    }).catch(err => {
      log(`Error = ${err}`, true)
    })
  }
  element.addEventListener('click', clickToBrowse)

  fileInput.addEventListener('change', () => {
    element.innerText = `Upload ${fileInput.files[0].name}`
    element.removeEventListener('click', clickToBrowse)
    element.addEventListener('click', uploadFile)
  });
}

export function setupLogOutRequest(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    worker
  } = opts
  
  element.addEventListener('click', () => {
    fetchWith(worker)('?logout').then(res => {
      log(`Success = ${res}`, true)
    }).catch(err => {
      log(`Error = ${err}`, true)
    })
  })
}


