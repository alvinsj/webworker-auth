
export function log(message: string, addEndLine  = false) {
  let statusEl = document.querySelector<HTMLDivElement>('#status')
  if(statusEl) {
    statusEl.innerHTML += '&#13;&#10;' + message + (addEndLine ? '&#13;&#10;' : '') 
    statusEl.scrollTop = statusEl.scrollHeight;
  }
  // console.log(message)
}
