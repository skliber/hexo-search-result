function insertSearchResult (args) {
 return `<div id="plugin-search-result"></div>
      <script>
      +function() {
        const searchResult = document.getElementById("plugin-search-result")
        searchResult.textContent = 'not found...'
        fetchData('/blog/search.xml').then(document => {
          const entries = analyzeData(document, getSearchQueryFromUrlParams())
          searchResult.innerHTML = makeSearchResult(entries)
        })
      
        function fetchData (fetchUrl) {
          return new Promise(resolve => {
            const xhr = new XMLHttpRequest()
            xhr.open('GET', fetchUrl, true)
            xhr.responseType = 'document'
            xhr.overrideMimeType('text/xml')
            xhr.onreadystatechange = () => {
              if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200 || xhr.status === 304) {
                  resolve(xhr.response)
                }
              }
            }
            xhr.send(null)
          })
        }
      
        function analyzeData(document, query) {
          const entries = document.getElementsByTagName('entry')
          const matchEntries = []
          for (var entry of entries) {
            const regExp = new RegExp(decodeURI(query))
            if (regExp.test(entry.querySelector('title').textContent) ||
                regExp.test(entry.querySelector('content').textContent)) {
              matchEntries.push(entry)
            }
          }
          return matchEntries
        }
      
        function makeSearchResult (entries) {
          let innerHTML = ''
          for (let entry of entries) {
            innerHTML += '<div class="search-result-entry">'
            const title = entry.querySelector('title').textContent
            const url = entry.querySelector('url').textContent
            const content = entry.querySelector('content').textContent
            innerHTML += '<h2><a href="' + url + '">' + title + '</a></h2>'
            const thumbnail = /<img[^>]*>/.exec(content)
            if (thumbnail && thumbnail.length >= 1) {
              innerHTML += '<div class="search-result-thumbnail">' + thumbnail[0] + '</div>'
            }
            innerHTML += content.replace(/<[^>]*>/g, '').substring(0, 300)
            innerHTML += '...</div>'
          }
          return innerHTML
        }
      
        function getSearchQueryFromUrlParams () {
          const params = window.location.search.substring(1).split('&')
          const search = params.filter(param => param.search(/$search=/))
          return search.length > 0 ? search[0].split('=')[1] : null
        }
      }()      
      </script>`
}

hexo.extend.tag.register('search_result', insertSearchResult)
