function getRequestDomain() {
  let protocol = window.location.protocol
  let hostname = window.location.hostname  
  return  protocol + '//' + hostname + ':3000'
}

export {
  getRequestDomain
}