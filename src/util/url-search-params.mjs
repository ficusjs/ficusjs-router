export class UrlSearchOrHashParams {
  constructor (url) {
    this.urlParamMap = {}
    let paramUrl
    let urlHash
    let paramPairs = []

    if (url.includes('?')) {
      paramUrl = url.substring(url.indexOf('?') + 1)
      if (paramUrl.includes('#')) {
        paramUrl = paramUrl.substring(0, paramUrl.indexOf('#'))
        urlHash = paramUrl.substring(paramUrl.indexOf('#') + 1)
      }
    } else if (url.includes('#')) {
      paramUrl = ''
      urlHash = url.substring(url.indexOf('#') + 1, url.length)
    }

    paramPairs = paramUrl ? paramUrl.split('&') : []

    if (urlHash && urlHash.includes('&') && urlHash.includes('=')) {
      paramPairs = [...paramPairs, ...urlHash.split('&')]
    }

    for (let i = 0; i < paramPairs.length; i++) {
      const paramComponents = paramPairs[i].split('=')
      if (paramComponents.length === 2) {
        this.urlParamMap[paramComponents[0]] = this._esc(decodeURIComponent(paramComponents[1]))
      }
    }
  }

  entries () {
    let entries = []
    for (const key in this.urlParamMap) {
      if (this.has(key)) {
        entries.push([key, this.urlParamMap[key]])
      }
    }

    entries = entries.sort(function (entryA, entryB) {
      if (entryA[0].toLowerCase() > entryB[0].toLowerCase()) {
        return 1
      }
      if (entryA[0].toLowerCase() < entryB[0].toLowerCase()) {
        return -1
      }
      return 0
    })

    return entries
  }

  remove (key) {
    delete this.urlParamMap[key]
  }

  get (key) {
    return this.urlParamMap[key]
  }

  has (key) {
    // eslint-disable-next-line no-prototype-builtins
    return this.urlParamMap.hasOwnProperty(key)
  }

  keys () {
    const keys = []
    for (const key in this.urlParamMap) {
      if (this.has(key)) {
        keys.push(key)
      }
    }
    return keys
  }

  set (key, val) {
    this.urlParamMap[key] = val
  }

  toString () {
    let paramsString = ''
    const entries = this.entries()
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (this.has(entry[0])) {
        paramsString += '&' + entry[0] + '=' + encodeURIComponent(this._unesc(entry[1]))
      }
    }
    return paramsString.substring(1)
  }

  values () {
    const values = []
    for (const key in this.urlParamMap) {
      if (this.has(key)) {
        values.push(this.urlParamMap[key])
      }
    }
    return values
  }

  _esc (s) {
    return String(s)
      .replace(/</g, '&lt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;')
      .replace(/>/g, '&gt;')
      .replace(/&/g, '&amp;')
  }

  _unesc (s) {
    return String(s)
      .replace(/&lt;/g, '<')
      .replace(/&#39;/g, '\'')
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
  }
}
