module.exports = {

  name: 'Canvas Create Image',

  section: 'Image Editing',

  version: '3.0.1',

  subtitle (data) {
    return `${data.url}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Image'])
  },

  fields: ['url', 'type', 'loop', 'delay', 'storage', 'varName'],

  html (isEvent, data) {
    return `
  <div>
    <a id="link" href='#'>Local URL</a> / Web URL:<br>
    <input id="url" class="round" type="text" value="resources/" placeholder="Support extension type (.png | .jpg | .gif)"><br>
  </div>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Image Type:<br>
      <select id="type" class="round" onchange="glob.onChange(this)">
        <option value="0" selected>Auto (.gif / .png / .jpg / .webp)</option>
        <option value="1">Animted Images (Local Image only)</option>
        <option value="2">Still Image (.png / .webp)</option>
      </select>
    </div>
  </div><br><br><br>
  <div id="gifOption" style="display: none; padding-top: 8px;">
    <div style="float: left; width: 50%;">
      Loop Default Value (integer):<br>
      <input id="loop" class="round" type="text" value="0" placeholder="(0 = Infinity)"><br>
    </div>
    <div style="float: right; width: 50%;">
      Delay Each Frame Default Value (ms):<br>
      <input id="delay" class="round" type="text" value="100"><br>
    </div>
  </div>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    document.getElementById('link').onclick = function () {
      require('child_process').execSync('start https://globster.xyz')
    }
    const gifOption = document.getElementById('gifOption')
    glob.onChange = function (event) {
      if (parseInt(event.value) === 2) {
        gifOption.style.display = 'none'
      } else {
        gifOption.style.display = null
      }
    }
    glob.onChange(document.getElementById('type'))
  },

  async action (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.type)
    const loop = parseInt(this.evalMessage(data.loop, cache))
    const delay = parseInt(this.evalMessage(data.delay, cache))
    const url = this.evalMessage(data.url, cache)
    try {
      let image
      if (type !== 2) {
        image = await this.Canvas.createImage(url, { loop, delay })
      } else {
        image = await this.Canvas.createImage(url)
      }
      const varName = this.evalMessage(data.varName, cache)
      const storage = parseInt(data.storage)
      this.storeValue(image, storage, varName, cache)
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    DBM.Actions.Canvas = DBM.Actions.Canvas || {}
    const chalk = DBM.Actions.getMods().require('chalk')
    DBM.Actions.Canvas.onError = (data, cache, err) => {
      const colors = ['FF4C4C', 'FFFF7F', '00FF7F']
      if (data && cache) {
        const text = 'Canvas ' + DBM.Actions.getErrorString(data, cache)
        console.error(chalk.hex(colors[0])(text))
      }
      if (err.message && err.message === 'Image given has not completed loading') {
        console.error(chalk.hex(colors[0])(err))
        console.error(chalk.hex(colors[1])('Possible Solution: Canvas mod only made for canvas.'))
      } else {
        console.error(chalk.hex(colors[0])(err))
      }
    }
    if (!DBM.Actions.Canvas.CanvasJS) {
      try {
        if (process.arch !== 'x64') {
          const commandExists = DBM.Actions.getMods().require('command-exists')
          if (commandExists.sync('node')) {
            const arch = require('child_process').execSync('node -p "process.arch"').toString()
            if (arch === 'x64\n') {
              console.log(chalk.hex('00FF7F')(`Canvas changed node.js ${process.arch} to node.js x64`))
              require('child_process').spawnSync('node', [process.argv[1]], { cwd: process.cwd(), stdio: [0, 1, 2] })
              process.exit()
            } else {
              console.error(chalk.hex('FFFF7F')(`Solution: Please install node.js x64 (currently is ${process.arch}) to your system! Get download 64-bit here https://nodejs.org/en/download/`))
            }
          } else {
            console.log('Node.js is not install on your system, please download here https://nodejs.org/en/download/')
          }
        } else {
          DBM.Actions.Canvas.CanvasJS = DBM.Actions.getMods().require('canvas')
        }
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    if (!DBM.Actions.Canvas.PixelGif) {
      try {
        DBM.Actions.Canvas.PixelGif = DBM.Actions.getMods().require('pixel-gif')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    if (!DBM.Actions.Canvas.Glob) {
      try {
        DBM.Actions.Canvas.Glob = DBM.Actions.getMods().require('glob')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    if (!DBM.Actions.Canvas.Fetch) {
      try {
        DBM.Actions.Canvas.Fetch = DBM.Actions.getMods().require('node-fetch')
      } catch (err) {
        DBM.Actions.Canvas.onError('', '', err)
      }
    }
    DBM.Actions.Canvas.solvePath = function (path) {
      const Path = require('path')
      path = Path.normalize(path)
      if (process.platform !== 'win32') {
        path = path.replace(/^\\\\\?\\/, '').replace(/\\/g, '/').replace(/\/\/+/g, '/')
      }
      return Path.resolve(Path.join(process.cwd(), path))
    }
    DBM.Actions.Canvas.loadDependencies = function () {
      const Path = require('path')
      let dependencies = this.Glob.sync(this.solvePath('canvas_dependencies\\*'))
      if (dependencies.length === 0) {
        throw new Error('Canvas dependencies not found')
      } else {
        dependencies = dependencies.filter((dependency) => {
          if (process.platform !== 'win32') {
            return ['', '.js'].includes(require('path').extname(dependency))
          } else {
            return ['.exe', '.js'].includes(require('path').extname(dependency))
          }
        })
        this.dependencies = []
        dependencies.forEach((dependency) => {
          this.dependencies[Path.basename(dependency).replace(Path.extname(dependency), '')] = dependency
        })
      }
    }
    DBM.Actions.Canvas.loadDependencies()
    DBM.Actions.Canvas.JimpFnc = {
      param0 (fncName) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1)
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName]()
          }
        } else {
          jimp[fncName]()
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      param1 (fncName, param1) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1)
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName](param1)
          }
        } else {
          jimp[fncName](param1)
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      param2 (fncName, param1, param2) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1, 'mirror')
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName](param1, param2)
          }
        } else {
          jimp[fncName](param1, param2)
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      param3 (fncName, param1, param2, param3) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1)
        const jimp2 = DBM.Actions.Canvas.bridge(param1, 1)
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName](jimp2, param2, param3)
          }
        } else {
          jimp[fncName](jimp2, param2, param3)
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      param5 (fncName, param1, param2, param3, param4, param5) {
        const jimp = DBM.Actions.Canvas.bridge(this, 1)
        if (this.animated) {
          for (let i = 0; i < this.totalFrames; i++) {
            jimp.images[i][fncName](param1, param2, param3, param4, param5) // width auto convert to Infinity if undefined
          }
        } else {
          jimp[fncName](param1, param2, param3, param4, param5)
        }
        const canvas = DBM.Actions.Canvas.bridge(jimp, 0)
        this.image = (this.animated) ? canvas.images : canvas.image
      },
      getBuffer (mine, cb) {
        try {
          if (typeof cb !== 'function') {
            throw new Error('cb must be a function')
          }
          cb(null, DBM.Actions.Canvas.toBuffer(DBM.Actions.Canvas.bridge(this, 0)))
        } catch (err) {
          cb(err)
        }
      },
      getBitmap () {
        const img = DBM.Actions.Canvas.loadImage(this)
        const { width, height } = img
        return { width, height }
      },
      drawImage (img1, img2, x, y) {
        for (let i = 0; i < img2.bitmap.width; i++) {
          for (let j = 0; j < img2.bitmap.height; j++) {
            const pos = (i * (img2.bitmap.width * 4)) + (j * 4)
            const pos2 = ((i + y) * (img1.bitmap.width * 4)) + ((j + x) * 4)
            const target = img1.bitmap.data
            const source = img2.bitmap.data
            for (let k = 0; k < 4; k++) {
              target[pos2 + k] = source[pos + k]
            }
          }
        }
        return img1
      }
    }

    DBM.Images.drawImageOnImage = function (img1, img2, x, y) {
      const jimp = DBM.Actions.Canvas.bridge(img1, 1)
      const jimp2 = DBM.Actions.Canvas.bridge(img2, 1)
      let tempImage = []
      if (Array.isArray(jimp)) {
        if (Array.isArray(jimp2)) {
          const maxFrame = Math.max(jimp.length, jimp2.length)
          let imgFrame = 0
          let img2Frame = 0
          for (let i = 0; i < maxFrame; i++) {
            tempImage.push(DBM.Actions.Canvas.JimpFnc.drawImage(jimp[imgFrame], jimp2[img2Frame], x, y))
            imgFrame = (imgFrame + 1 >= jimp.length) ? 0 : imgFrame + 1
            img2Frame = (img2Frame + 1 >= jimp2.length) ? 0 : img2Frame + 1
          }
        } else {
          for (let i = 0; i < jimp.length; i++) {
            tempImage.push(DBM.Actions.Canvas.JimpFnc.drawImage(jimp[i], jimp2, x, y))
          }
        }
      } else if (Array.isArray(jimp2)) {
        for (let i = 0; i < jimp2.length; i++) {
          tempImage.push(DBM.Actions.Canvas.JimpFnc.drawImage(jimp, jimp2[i], x, y))
        }
      } else {
        tempImage = DBM.Actions.Canvas.JimpFnc.drawImage(jimp, jimp2, x, y)
      }
      if (Array.isArray(tempImage)) {
        for (let i = 0; i < tempImage.length; i++) {
          if (i < img1.images.length) {
            img1.images[i] = DBM.Actions.Canvas.bridge(tempImage[i], 0).image
          } else {
            img1.images.push(DBM.Actions.Canvas.bridge(tempImage[i], 0).image)
            img1.totalFrames = img1.images.length
          }
        }
      } else {
        img1.image = DBM.Actions.Canvas.bridge(tempImage, 0).image
      }
    }

    DBM.Actions.Canvas.JimpImage = function (canvas, images) { // mainly for gif
      this.name = 'jimp'
      this.extensions = ['.gif']
      this.animated = true
      this.images = images // will hold jimp object here
      this.width = canvas.width
      this.height = canvas.height
      this.delay = canvas.delay // delay (fps)
      this.loop = canvas.loop // loop type, once or forever
      this.totalFrames = canvas.length
    }

    DBM.Actions.Canvas.Image = function (source, options) {
      this.name = 'canvas'
      if (Array.isArray(source)) {
        this.extensions = ['.gif']
        this.images = source
        this.animated = true
        this.width = options.width
        this.height = options.height
        this.delay = options.delay
        this.loop = options.loop
        this.totalFrames = source.length
      } else {
        this.extensions = ['.png', '.jpg', '.webp'] // sort by prefer
        this.image = source
        this.animated = false
      }

      // jimp fnc compability
      this.greyscale = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'greyscale')
      this.invert = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'invert')
      this.normalize = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'normalize')
      this.opaque = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'opaque')
      this.sepia = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'sepia')
      this.dither565 = () => DBM.Actions.Canvas.JimpFnc.param0.call(this, 'dither565')

      this.blur = (param1) => DBM.Actions.Canvas.JimpFnc.param1.call(this, 'blur', param1)
      this.rotate = (param1) => DBM.Actions.Canvas.JimpFnc.param1.call(this, 'rotate', param1)
      this.pixelate = (param1) => DBM.Actions.Canvas.JimpFnc.param1.call(this, 'pixelate', param1)

      this.mirror = (param1, param2) => DBM.Actions.Canvas.JimpFnc.param2.call(this, 'mirror', param1, param2)
      this.resize = (param1, param2) => DBM.Actions.Canvas.JimpFnc.param2.call(this, 'resize', param1, param2)

      this.mask = (param1, param2, param3) => DBM.Actions.Canvas.JimpFnc.param3.call(this, 'mask', param1, param2, param3)
      this.composite = (param1, param2, param3) => DBM.Actions.Canvas.JimpFnc.param3.call(this, 'composite', param1, param2, param3)

      this.print = (param1, param2, param3, param4, param5) => DBM.Actions.Canvas.JimpFnc.param5.call(this, 'print', param1, param2, param3, param4, param5)

      this.bitmap = DBM.Actions.Canvas.JimpFnc.getBitmap.call(this)
      this.getBuffer = DBM.Actions.Canvas.JimpFnc.getBuffer
    }

    DBM.Actions.Canvas.loadImage = function (sourceImage) {
      if (sourceImage.constructor.name.toLowerCase() === 'jimp' || sourceImage.name.toLowerCase() === 'jimp') sourceImage = this.bridge(sourceImage, 0) // auto convert if it is jimp image
      if (sourceImage.animated) {
        const images = []
        for (let i = 0; i < sourceImage.images.length; i++) {
          const image = new this.CanvasJS.Image()
          image.src = sourceImage.images[i]
          images.push(image)
        }
        return images
      } else {
        const image = new this.CanvasJS.Image()
        image.src = sourceImage.image
        return image
      }
    }

    DBM.Actions.Canvas.createImage = async function (path, options) {
      const Path = require('path')
      const fs = require('fs')
      let type
      if (options && !!options.isCache) {
        type = 'local'
      } else {
        try {
          // eslint-disable-next-line no-new
          new URL(path)
          type = 'url'
        } catch (err) {
          type = 'local'
        }
      }
      if (type === 'local') {
        let files
        if (options && !!options.isCache) {
          files = this.Glob.sync(this.solvePath(path)).filter(file => ['.gif', '.webp', '.png', '.jpg'].includes(Path.extname(file).toLowerCase()))
        } else {
          files = [path]
        }
        if (files.length === 0) {
          throw new Error('Image not exist!')
        } else if (files.length === 1) {
          const extname = Path.extname(files[0]).toLowerCase()
          if (extname.startsWith('.gif')) {
            return new this.Image(await this.loadGif(files[0]))
          } else if (extname.startsWith('.webp')) {
            const temp = fs.mkdtempSync(require('os').tmpdir() + Path.sep)
            require('child_process').execSync(`"${this.dependencies.dwebp}" "${files[0]}" -quiet -o "${temp}${Path.sep}temp.png"`)
            const img = 'data:image/png;base64,' + fs.readFileSync(`${temp}${Path.sep}temp.png`).toString('base64')
            fs.rmdirSync(temp, { recursive: true })
            return new this.Image(img)
          } else {
            const image = await this.CanvasJS.loadImage(files[0])
            const canvas = this.CanvasJS.createCanvas(image.width, image.height)
            const ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0)
            const returnImg = canvas.toDataURL('image/png')
            const width = image.width
            const height = image.height
            if (options && !!options.isCache) {
              return { returnImg, width, height } // getting biggest dimension
            } else {
              return new this.Image(returnImg)
            }
          }
        } else {
          return await this.loadGif(files, options)
        }
      } else if (type === 'url') {
        if (Path.extname(path).toLowerCase().startsWith('.webp')) {
          const res = await this.Fetch(path)
          const temp = fs.mkdtempSync(require('os').tmpdir() + Path.sep)
          fs.writeFileSync(`${temp}${Path.sep}temp.webp`, await res.buffer())
          require('child_process').execSync(`"${this.dependencies.dwebp}" "${temp}${Path.sep}temp.webp" -quiet -o "${temp}${Path.sep}temp.png"`)
          const img = 'data:image/png;base64,' + fs.readFileSync(`${temp}${Path.sep}temp.png`).toString('base64')
          fs.rmdirSync(temp, { recursive: true })
          return new this.Image(img)
        } else if (Path.extname(path).toLowerCase().startsWith('.gif')) { // need test for online .gif
          return await this.loadGif(path) // weird maybe need download and createImage() again with cache
        } else { // need test for online .jpg and .png
          const image = await this.CanvasJS.loadImage(path)
          const canvas = this.CanvasJS.createCanvas(image.width, image.height)
          const ctx = canvas.getContext('2d')
          ctx.drawImage(image, 0, 0)
          return new this.Image(canvas.toDataURL('image/png'))
        }
      }
    }

    DBM.Actions.Canvas.loadGif = async function (path, options) {
      let images = []; let loop; let delay; let width; let height
      if (Array.isArray(path)) {
        console.log('Auto picked for the first image')
        path = path[0] // autopick?
      }
      if (require('path').extname(path) === '.gif') {
        const parsedGif = await this.PixelGif.parse(path)
        const canvas = this.CanvasJS.createCanvas(parsedGif[0].width, parsedGif[0].height)
        const ctx = canvas.getContext('2d')
        let imageData = ctx.getImageData(0, 0, parsedGif[0].width, parsedGif[0].height)
        const backupImageData = imageData
        const tmpImages = (await this.PixelGif.parse(path)).filter(image => image != null)
        for (let i = 0; i < tmpImages.length; i++) {
          imageData = backupImageData
          for (let d = 0; d < parsedGif[i].data.length; d++) {
            imageData.data[d] = parsedGif[i].data[d]
          }
          ctx.putImageData(imageData, 0, 0)
          images.push(canvas.toDataURL('image/png'))
        }
        delay = parsedGif.map(i => i.delay).reduce((a, c) => a + c, 0) / parsedGif.length
        loop = (parsedGif.loop) ? parsedGif.loop : 0
        width = parsedGif[0].width
        height = parsedGif[0].height
      } else {
        images = []
        const allWidth = []
        const allHeight = []
        for (let i = 0; i < path.length; i++) {
          const image = await this.createImage(path[i], { isCache: true }) // made create image without research it again, minimize the time for function
          images.push(image.returnImg)
          allWidth.push(image.width)
          allHeight.push(image.height)
        }
        delay = (options.delay) ? options.delay : 100 // default value (ms)
        loop = (options.loop) ? options.loop : 0 // default value
        width = Math.max(...allWidth)
        height = Math.max(...allHeight)
      }
      return new this.Image(images, { delay, loop, width, height })
    }
  }
}
