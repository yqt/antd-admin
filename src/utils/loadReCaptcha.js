const loadReCaptcha = () => {
  const scriptId = 'google-recaptcha'
  if (document.getElementById(scriptId)) {
    return
  }
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.defer = true
  script.id = scriptId

  script.src = '//www.recaptcha.net/recaptcha/api.js'
  //script.src = "https://www.google.com/recaptcha/api.js";
  document.body.appendChild(script)
}

export default loadReCaptcha
