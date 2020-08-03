const { readdirSync, writeFileSync } = require('fs')

const files = readdirSync('../events')
const mods = {}

for (const file of files) {
  const { name } = require(`../events/${file}`)
  mods[file] = { description: '', name }
}

writeFileSync('events.json', JSON.stringify(mods, null, 2))
