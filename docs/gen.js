const { readdirSync, writeFileSync } = require('fs')

const files = readdirSync('../actions')
const mods = {}

for (const file of files) {
  const { name, section } = require(`../actions/${file}`)
  mods[file] = { description: '', name, section }
}

writeFileSync('mods.json', JSON.stringify(mods, null, 2))
