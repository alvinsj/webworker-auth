import './style.css'
import {
  setupLoginRequest, 
  setupSendAnAuthenticatedRequest,
  setupUploadRequest,
  setupLogOutRequest
} from './handlers'
import { log } from './log'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Web Worker Auth</h1>
    <main>
      <section id="steps">
        <h2>Actions</h2>
        <ol>
          <li><button id="login">Login</button></li>
          <li><button id="send">Send an authenticated request</button></li>
          <li><button id="upload">Upload a file</button><input type="file" hidden accept=".csv" id="fileUpload"/> </li>
          <li><button id="download">Download a file</button></li>
          <li><button id="logout">Log out</button></li>
        </ol>
      </section>
      <section id="log">
        <h2>Logs</h2>
        <textarea id="status">
        </textarea>
      </section>
    </main>
  </div>
`
if (window.Worker) {
  const worker = new Worker(new URL('./worker.ts', import.meta.url))
  setupLoginRequest(
    document.querySelector<HTMLButtonElement>('#login')!, { 
      worker 
    }
  )
  setupSendAnAuthenticatedRequest(
    document.querySelector<HTMLButtonElement>('#send')!, { 
      worker 
    }
  )

  setupUploadRequest(
    document.querySelector<HTMLButtonElement>('#upload')!, { 
      worker, fileInputSelector: '[type=file]#fileUpload'
    }
  )

  setupLogOutRequest(
    document.querySelector<HTMLButtonElement>('#logout')!, { 
      worker 
    }
  )
  
} else {
  log('Your browser doesn\'t support web workers.');
}


