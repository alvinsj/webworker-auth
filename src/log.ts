
export function log(message: string) {
  let statusEl = document.querySelector<HTMLDivElement>('#status')
  if(statusEl) {
    statusEl.innerHTML += '&#13;&#10;' + message
    statusEl.scrollTop = statusEl.scrollHeight;
  }

  // console.log(message)
}
