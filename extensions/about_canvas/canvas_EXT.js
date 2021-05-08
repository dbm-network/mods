module.exports = {

  name: 'About Canvas Mod',

  github: 'github.com/LeonZ2019',

  isEditorExtension: true,

  fields: [],

  defaultFields: {
  },

  size () {
    return { width: 500, height: 425 }
  },

  html () {
    return `
  <div style="float: left; width: 99%; margin-left: auto; margin-right: auto; margin-top: auto; margin-bottom: auto; padding:10px;">
    <h3 style="text-align: center;">About Canvas Mod</h3>
    <img width="300" style="display: block; margin-left: auto; margin-right: auto;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNjAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xODkuMSwyOC4zYzAtMS42LTAuOS0zLjEtMi4zLTRMMTQ5LjEsMi42Yy0wLjYtMC40LTEuNC0wLjYtMi4xLTAuNg0KCQljLTAuMSwwLTAuMywwLTAuNCwwYy0wLjcsMC0xLjQsMC4yLTIuMSwwLjZsLTM3LjcsMjEuN2MtMS40LDAuOC0yLjMsMi4zLTIuMyw0bDAuMSw1OC40YzAsMC44LDAuNCwxLjYsMS4xLDINCgkJYzAuNywwLjQsMS42LDAuNCwyLjMsMGwyMi40LTEyLjhjMS40LTAuOCwyLjMtMi4zLDIuMy0zLjlWNDQuNmMwLTEuNiwwLjktMy4xLDIuMy0zLjlsOS41LTUuNWMwLjctMC40LDEuNS0wLjYsMi4zLTAuNg0KCQljMC44LDAsMS42LDAuMiwyLjMsMC42bDkuNSw1LjVjMS40LDAuOCwyLjMsMi4zLDIuMywzLjl2MjcuM2MwLDEuNiwwLjksMy4xLDIuMywzLjlsMjIuNCwxMi44YzAuNywwLjQsMS42LDAuNCwyLjMsMA0KCQljMC43LTAuNCwxLjEtMS4yLDEuMS0yTDE4OS4xLDI4LjN6Ii8+DQoJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjRkZGRkZGIiBkPSJNMjYuNSwyLjRjLTEuNiwwLTMuMSwwLjktNCwyLjNMMC45LDQyLjNjLTAuNCwwLjYtMC42LDEuNC0wLjYsMi4xYzAsMC4xLDAsMC4zLDAsMC40DQoJCWMwLDAuNywwLjIsMS40LDAuNiwyLjFsMjEuNywzNy43YzAuOCwxLjQsMi4zLDIuMyw0LDIuM2w1OC40LTAuMWMwLjgsMCwxLjYtMC40LDItMS4xYzAuNC0wLjcsMC40LTEuNiwwLTIuM0w3NCw2MC45DQoJCWMtMC44LTEuNC0yLjMtMi4zLTMuOS0yLjNINDIuOGMtMS42LDAtMy4xLTAuOS0zLjktMi4zbC01LjUtOS41Yy0wLjQtMC43LTAuNi0xLjUtMC42LTIuM2MwLTAuOCwwLjItMS42LDAuNi0yLjNsNS41LTkuNQ0KCQljMC44LTEuNCwyLjMtMi4zLDMuOS0yLjNoMjcuM2MxLjYsMCwzLjEtMC45LDMuOS0yLjNMODYuOCw1LjljMC40LTAuNywwLjQtMS42LDAtMi4zYy0wLjQtMC43LTEuMi0xLjEtMi0xLjFMMjYuNSwyLjR6Ii8+DQoJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjNjc5RTYzIiBkPSJNMTQ2LjMsNDAuNmMwLjMtMC4yLDAuNi0wLjIsMC45LDBsNy4yLDQuMmMwLjMsMC4yLDAuNCwwLjQsMC40LDAuOHY4LjMNCgkJYzAsMC4zLTAuMiwwLjYtMC40LDAuOGwtNy4yLDQuMmMtMC4zLDAuMi0wLjYsMC4yLTAuOSwwbC03LjItNC4yYy0wLjMtMC4yLTAuNC0wLjQtMC40LTAuOHYtOC4zYzAtMC4zLDAuMi0wLjYsMC40LTAuOEwxNDYuMyw0MC42DQoJCXoiLz4NCgk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yOTEuOSwyOS4yYzAtMS42LTAuOS0zLjEtMi4zLTRMMjUxLjksMy41Yy0wLjYtMC40LTEuNC0wLjYtMi4xLTAuNg0KCQljLTAuMSwwLTAuMywwLTAuNCwwYy0wLjcsMC0xLjQsMC4yLTIuMSwwLjZsLTM3LjcsMjEuN2MtMS40LDAuOC0yLjMsMi4zLTIuMyw0bDAuMSw1OC40YzAsMC44LDAuNCwxLjYsMS4xLDINCgkJYzAuNywwLjQsMS42LDAuNCwyLjMsMGwyMi40LTEyLjhjMS40LTAuOCwyLjMtMi4zLDIuMy0zLjlWNDUuNWMwLTEuNiwwLjktMy4xLDIuMy0zLjlsOS41LTUuNWMwLjctMC40LDEuNS0wLjYsMi4zLTAuNg0KCQljMC44LDAsMS42LDAuMiwyLjMsMC42bDkuNSw1LjVjMS40LDAuOCwyLjMsMi4zLDIuMywzLjl2MjcuM2MwLDEuNiwwLjksMy4xLDIuMywzLjlsMjIuNCwxMi44YzAuNywwLjQsMS42LDAuNCwyLjMsMA0KCQljMC43LTAuNCwxLjEtMS4yLDEuMS0yTDI5MS45LDI5LjJ6Ii8+DQoJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjRkZGRkZGIiBkPSJNMzEwLjYsNjMuNmMwLDEuNiwwLjksMy4xLDIuMyw0bDM3LjcsMjEuN2MwLjYsMC40LDEuNCwwLjYsMi4xLDAuNmMwLjEsMCwwLjMsMCwwLjQsMA0KCQljMC43LDAsMS40LTAuMiwyLjEtMC42bDM3LjctMjEuN2MxLjQtMC44LDIuMy0yLjMsMi4zLTRsLTAuMS01OC40YzAtMC44LTAuNC0xLjYtMS4xLTJjLTAuNy0wLjQtMS42LTAuNC0yLjMsMGwtMjIuNCwxMi44DQoJCWMtMS40LDAuOC0yLjMsMi4zLTIuMywzLjl2MjcuM2MwLDEuNi0wLjksMy4xLTIuMywzLjlsLTkuNSw1LjVjLTAuNywwLjQtMS41LDAuNi0yLjMsMC42Yy0wLjgsMC0xLjYtMC4yLTIuMy0wLjZsLTkuNS01LjUNCgkJYy0xLjQtMC44LTIuMy0yLjMtMi4zLTMuOVYyMGMwLTEuNi0wLjktMy4xLTIuMy0zLjlMMzE0LDMuM2MtMC43LTAuNC0xLjYtMC40LTIuMywwYy0wLjcsMC40LTEuMSwxLjItMS4xLDJMMzEwLjYsNjMuNnoiLz4NCgk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNGRkZGRkYiIGQ9Ik00OTguMSwyOS4yYzAtMS42LTAuOS0zLjEtMi4zLTRMNDU4LjEsMy41Yy0wLjYtMC40LTEuNC0wLjYtMi4xLTAuNg0KCQljLTAuMSwwLTAuMywwLTAuNCwwYy0wLjcsMC0xLjQsMC4yLTIuMSwwLjZsLTM3LjcsMjEuN2MtMS40LDAuOC0yLjMsMi4zLTIuMyw0bDAuMSw1OC40YzAsMC44LDAuNCwxLjYsMS4xLDINCgkJYzAuNywwLjQsMS42LDAuNCwyLjMsMGwyMi40LTEyLjhjMS40LTAuOCwyLjMtMi4zLDIuMy0zLjlWNDUuNWMwLTEuNiwwLjktMy4xLDIuMy0zLjlsOS41LTUuNWMwLjctMC40LDEuNS0wLjYsMi4zLTAuNg0KCQljMC44LDAsMS42LDAuMiwyLjMsMC42bDkuNSw1LjVjMS40LDAuOCwyLjMsMi4zLDIuMywzLjl2MjcuM2MwLDEuNiwwLjksMy4xLDIuMywzLjlsMjIuNCwxMi44YzAuNywwLjQsMS42LDAuNCwyLjMsMA0KCQljMC43LTAuNCwxLjEtMS4yLDEuMS0yTDQ5OC4xLDI5LjJ6Ii8+DQoJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjNjc5RTYzIiBkPSJNNDU1LjIsNDEuNWMwLjMtMC4yLDAuNi0wLjIsMC45LDBsNy4yLDQuMmMwLjMsMC4yLDAuNCwwLjQsMC40LDAuOHY4LjMNCgkJYzAsMC4zLTAuMiwwLjYtMC40LDAuOGwtNy4yLDQuMmMtMC4zLDAuMi0wLjYsMC4yLTAuOSwwbC03LjItNC4yYy0wLjMtMC4yLTAuNC0wLjQtMC40LTAuOHYtOC4zYzAtMC4zLDAuMi0wLjYsMC40LTAuOEw0NTUuMiw0MS41DQoJCXoiLz4NCjwvZz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iNTE4LjQ2MTkiIHkxPSI1OS41MTQ2IiB4Mj0iNTk4LjE1ODkiIHkyPSI0MS4xMTUxIj4NCgk8c3RvcCAgb2Zmc2V0PSIwLjEzNzYiIHN0eWxlPSJzdG9wLWNvbG9yOiM2QUJGNEIiLz4NCgk8c3RvcCAgb2Zmc2V0PSIwLjkiIHN0eWxlPSJzdG9wLWNvbG9yOiMzREFFMkIiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzFfKSIgZD0iTTU3OS40LDM4LjNDNTc5LjQsMzguMyw1NzkuNCwzOC4yLDU3OS40LDM4LjNjLTAuMi0wLjEtMC4zLTAuMi0wLjQtMC4yYzAsMC0wLjEsMC0wLjEsMA0KCWMtMC4xLTAuMS0wLjMtMC4yLTAuNC0wLjNjMCwwLTAuMSwwLTAuMS0wLjFjLTEuNi0wLjktMy4zLTEuOS01LTIuOWMtMC4yLTAuMS0wLjUtMC4zLTAuNy0wLjRjLTAuNC0wLjItMC44LTAuNS0xLjItMC43DQoJYy0wLjEsMC0wLjItMC4xLTAuMy0wLjJjLTEuNi0wLjktMy4yLTEuOC00LjgtMi43Yy0wLjItMC4xLTAuNC0wLjItMC42LTAuM2MtMS44LTEtMy41LTItNS4zLTNjLTAuMy0wLjItMC42LTAuMy0wLjktMC41DQoJYy0yLTEuMi00LTIuMy01LjgtMy40Yy0wLjItMC4xLTAuNC0wLjMtMC43LTAuNGMtMC40LTAuMi0wLjgtMC41LTEuMi0wLjdjLTAuNy0wLjQtMS4zLTAuOC0yLTEuMmMtMS4yLTAuNy0yLjQtMS40LTMuNS0yDQoJYy0wLjEtMC4xLTAuMy0wLjItMC40LTAuMmMtMS42LTAuOS0zLjEtMS44LTQuMy0yLjVjLTAuMi0wLjEtMC41LTAuMy0wLjctMC40Yy0wLjYtMC4zLTEuMS0wLjYtMS41LTAuOWMtMC4yLTAuMS0wLjQtMC4yLTAuNi0wLjMNCgljLTAuMy0wLjItMC41LTAuMy0wLjgtMC40Yy0wLjEsMC0wLjEtMC4xLTAuMi0wLjFjLTAuMS0wLjEtMC4yLTAuMS0wLjMtMC4yYy0wLjEsMC0wLjEtMC4xLTAuMi0wLjFjMCwwLTAuMSwwLTAuMS0wLjFsLTE4LjcsMTAuOA0KCWMtMS40LDAuOC0yLjIsMi4zLTIuMiwzLjl2MjEuN2MxLjIsMC43LDEzLjgsOCwyNy40LDE1LjhjMC4xLDAsMC4xLDAuMSwwLjIsMC4xYzUuMywzLjEsMTAuNyw2LjIsMTUuNyw5LjFjMC4zLDAuMSwwLjUsMC4zLDAuOCwwLjQNCgljMC41LDAuMywxLDAuNiwxLjYsMC45YzAuMSwwLjEsMC4yLDAuMSwwLjQsMC4yYzkuNiw1LjUsMTYuOSw5LjcsMTYuOSw5LjdjMCwwLDE0LjUtOC40LDE5LjQtMTEuMmMwLjgtMC42LDEuNC0xLjYsMS42LTIuNg0KCWMwLTUuNSwwLTIyLjYsMC0yMi42QzYwMC4zLDUwLjMsNTkwLjksNDQuOSw1NzkuNCwzOC4zeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8yXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI1OTQuMTM3OCIgeTE9IjM0LjYzMyIgeDI9IjU0Mi41NjcxIiB5Mj0iNC44NTg2Ij4NCgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojNkFCRjRCIi8+DQoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzNGODczRiIvPg0KPC9saW5lYXJHcmFkaWVudD4NCjxwYXRoIGZpbGw9InVybCgjU1ZHSURfMl8pIiBkPSJNNTM3LjYsMTQuMWMwLjEsMC4xLDAuMiwwLjEsMC4zLDAuMmMwLDAsMC4xLDAuMSwwLjIsMC4xYzAuMiwwLjEsMC41LDAuMywwLjgsMC40DQoJYzAuMiwwLjEsMC40LDAuMiwwLjYsMC4zYzAuNCwwLjMsMSwwLjYsMS41LDAuOWMwLjIsMC4xLDAuNSwwLjMsMC43LDAuNGMxLjIsMC43LDIuNywxLjYsNC4zLDIuNWMwLjEsMC4xLDAuMywwLjIsMC40LDAuMg0KCWMxLjEsMC42LDIuMywxLjMsMy41LDJjMC43LDAuNCwxLjMsMC44LDIsMS4yYzAuNCwwLjIsMC44LDAuNSwxLjIsMC43YzAuMiwwLjEsMC40LDAuMywwLjcsMC40YzEuOSwxLjEsMy45LDIuMiw1LjgsMy40DQoJYzAuMywwLjIsMC42LDAuMywwLjksMC41YzEuOCwxLDMuNiwyLjEsNS4zLDNjMC4yLDAuMSwwLjQsMC4yLDAuNiwwLjNjMS43LDEsMy4zLDEuOSw0LjgsMi43YzAuMSwwLjEsMC4yLDAuMSwwLjMsMC4yDQoJYzAuNCwwLjIsMC44LDAuNSwxLjIsMC43YzAuMiwwLjEsMC41LDAuMywwLjcsMC40YzIuMiwxLjMsMy45LDIuMyw1LDIuOWMwLDAsMC4xLDAsMC4xLDAuMWMwLjIsMC4xLDAuMywwLjIsMC40LDAuMw0KCWMwLDAsMC4xLDAsMC4xLDBjMC4yLDAuMSwwLjMsMC4yLDAuNCwwLjJjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBsMTcuNy0xMC4yYzEuNS0wLjksMS41LTMsMC0zLjlMNTYwLDIuOGMtMS4yLTAuNS0yLjctMC40LTMuOSwwLjMNCglMNTM3LjQsMTRjMCwwLDAuMSwwLDAuMSwwLjFDNTM3LjUsMTQuMSw1MzcuNiwxNC4xLDUzNy42LDE0LjF6Ii8+DQo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzNfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjU3NC4wNDY5IiB5MT0iOTUuNzI5NyIgeDI9IjUyMi42NjQ5IiB5Mj0iNjYuMDY0MyI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzZBQkY0QiIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMzRjg3M0YiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBmaWxsPSJ1cmwoI1NWR0lEXzNfKSIgZD0iTTU2Mi40LDc2LjljLTAuMS0wLjEtMC4yLTAuMS0wLjQtMC4yYy0wLjUtMC4zLTEtMC42LTEuNi0wLjljLTAuMy0wLjEtMC41LTAuMy0wLjgtMC40DQoJYy01LjYtMy4zLTExLjQtNi42LTE1LjctOS4xYy0wLjEsMC0wLjEtMC4xLTAuMi0wLjFjLTMuOS0yLjItNi40LTMuNy02LjUtMy43YzAsMC0xMS44LDYuOC0xNy43LDEwLjJjLTEuNSwwLjktMS41LDMsMCwzLjlsMzYuNSwyMQ0KCWMxLjIsMC43LDIuNiwwLjgsMy45LDAuM2M1LTIuOSwxOS4zLTExLjEsMTkuMy0xMS4xQzU3OS4zLDg2LjYsNTcxLjQsODIuMSw1NjIuNCw3Ni45eiIvPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K">
    <h5 id="status" style="text-align: center;">Idle</h5>
    <h4 id="version" style="text-align: center;">Current Version: </h4>
    <div style="margin-left: auto; margin-right: auto; text-align: center; width: 300px;">
      <button id="update" class="updateButton"><i class="plus icon"></i>Check for Updates</button>
    </div>
  </div>
  <style>
  .updateButton {
    height: 25px;
    width: 180px;
    color: #646464;
    background-color: #e1e1e1;
    outline: none;
    border-radius: 3px;
    font-size: 13px;
    font-family: monospace;
    transition: all 0.5s;
    cursor: pointer;
  }
  .updateButton:hover {
    background-color: #cbcbcb;
  }
  .updateButton:active {
    background-color: #bbbbbb;
  }
  </style>`
  },

  init (document, globalObject) {
    delete require.cache[require.resolve('../actions/canvas_create_image_MOD')]
    const version = require('../actions/canvas_create_image_MOD').version
    document.getElementById('version').innerText = `Current Version: ${version}`
    document.getElementById('update').onclick = function () {
      const fetch = require('node-fetch')
      const unzip = require('unzipper')
      const fs = require('fs')
      const path = require('path')

      function getVersion (version) {
        const major = parseInt(version.split('.')[0])
        const minor = parseInt(version.split('.')[1])
        const revision = parseInt(version.split('.')[2])
        return { major, minor, revision }
      }

      function copyFolder (source, target) {
        if (!fs.existsSync(target)) fs.mkdirSync(target)
        const files = fs.readdirSync(source)
        files.forEach(file => {
          const filePath = path.join(source, file)
          const destPath = path.join(target, file)
          if (fs.lstatSync(filePath).isDirectory()) {
            copyFolder(filePath, destPath)
          } else {
            document.getElementById('status').innerText = `Extracting ${filePath}...`
            if (fs.existsSync(destPath)) fs.unlinkSync(destPath)
            fs.copyFileSync(filePath, destPath, fs.constants.COPYFILE_FICLONE)
            globalObject['console-log'](`Extracted from ${filePath} to ${destPath}`)
          }
        })
      }

      // function deleteFolderRecursive (directory) {
      //   if (fs.existsSync(directory)) {
      //     fs.readdirSync(directory).forEach(file => {
      //       const curPath = path.join(directory, file)
      //       if (fs.lstatSync(curPath).isDirectory()) {
      //         deleteFolderRecursive(curPath)
      //       } else {
      //         fs.unlinkSync(curPath)
      //       }
      //     })
      //     fs.rmdirSync(directory)
      //   }
      // }

      async function update (json) {
        document.getElementById('status').innerText = `Downloading files from to GitHub ${repository} v ${json.tag_name}`
        globalObject['console-log'](`Downloading files from to GitHub ${repository} v ${json.tag_name}`)
        const temp = fs.mkdtempSync(require('os').tmpdir() + path.sep)
        const zip = await fetch(json.zipball_url)
        zip.body.pipe(unzip.Extract({ path: temp }))
        zip.body.on('end', async () => {
          const cwd = path.join(temp, fs.readdirSync(temp)[0])
          const files = fs.readdirSync(cwd)
          files.forEach(file => {
            const filePath = path.join(cwd, file)
            const desPath = path.join(globalObject._currentProject, file)
            if (fs.lstatSync(filePath).isDirectory()) {
              copyFolder(filePath, desPath)
            } else {
              document.getElementById('status').innerText = `Extracting ${filePath}...`
              if (fs.existsSync(desPath)) fs.unlinkSync(desPath)
              fs.copyFileSync(filePath, desPath, fs.constants.COPYFILE_FICLONE)
              globalObject['console-log'](`Extracted from ${filePath} to ${desPath}`)
            }
          })
          document.getElementById('status').innerText = 'Cleaning temp folder... '
          // deleteFolderRecursive(temp) nodejs v10.10.0
          document.getElementById('status').innerText = 'Canvas mod is up to date'
          document.getElementById('version').innerText = `Current Version: ${json.tag_name}`
          globalObject['console-log']('Canvas mod is up to date')
          globalObject['console-log'](`Current Version: ${json.tag_name}`)
          globalObject.reloadData()
          globalObject.openLogWindow()
        })
      }

      document.getElementById('status').innerText = 'Checking for updates...'
      globalObject['console-log']('Checking for updates...')
      const api = 'https://api.github.com/repos/'
      const repository = 'LeonZ2019/dbm-canvas'
      const release = '/releases/latest'
      fetch(api + repository + release).then(async (res) => {
        const json = await res.json()
        if (json.message) {
          document.getElementById('status').innerText = 'Canvas mod release not found'
          return
        }
        const current = getVersion(version)
        const latest = getVersion(json.tag_name)
        if (latest.major > current.major) {
          await update(json)
        } else if (latest.major === current.major) {
          if (latest.minor > current.minor) {
            await update(json)
          } else if (latest.minor === current.minor) {
            if (latest.revision > current.revision) {
              await update(json)
            }
          }
        }
      })
    }
  },

  close () {
    this.DBM.reloadData()
  },

  mod () {
  }
}
