import { fetchWith, uploadWith, downloadWith } from './fetchWith'
import { log } from './log'

export type SetupOpts = {
  statusEl?: HTMLDivElement,
  worker: Worker
}

export type SetupUploadOpts = {
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
    fetchWith(worker)('?login', { body: JSON.stringify({username, password}) })
    .then(res => {
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
    fetchWith(worker)('/new', {
      method: 'POST',
      body: JSON.stringify({name: 'alvin'})
    }).then(res => {
      log(`Success = ${res}`, true)
    }).catch(err => {
      log(`Error = ${err}`, true)
    })
  })
}

export function setupSendDifferentDomainRequest(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    worker
  } = opts
  
  element.addEventListener('click', () => {
    fetchWith(worker)('http://fake-a-csrf-domain.com/new', {
      method: 'POST',
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

  const fileInput = document.querySelector(fileInputSelector)! as HTMLInputElement
  const clickToBrowse = () => {
    fileInput.click()
  }
  const uploadFile = () => {
    uploadWith(worker)('/upload', fileInput.files![0]).then(res => {
      log(`Success = ${res}`, true)
    }).catch(err => {
      log(`Error = ${err}`, true)
    })
  }
  element.addEventListener('click', clickToBrowse)

  fileInput.addEventListener('change', () => {
    element.innerText = `Upload ${fileInput.files![0].name}`
    element.removeEventListener('click', clickToBrowse)
    element.addEventListener('click', uploadFile)
  });
}

export function setupDownloadRequest(element: HTMLButtonElement, opts: SetupOpts) {
  const {
    worker
  } = opts

  const clickToDownload = () => {
    element.disabled = true
    element.innerText = 'Downloading...'
    downloadFile()
  }
  const downloadFile = () => {
    // FIXME hardcode for example
    downloadWith(worker)('/api/download').then(res => {
      log(`Success = Downloaded ${res}`, true)
    }).catch(err => {    
      log(`Error = ${err}`, true)
    }).finally(() => {
      element.innerText = 'Download a file'
      element.disabled = false
    })
  }
  element.addEventListener('click', clickToDownload)
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
