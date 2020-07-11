const { appendFileSync, readdirSync, writeFileSync } = require('fs')

writeFileSync('master.json', '{\n')

const files = readdirSync('../actions')

for (const file of files) {
  const isLast = files.indexOf(file) === files.length - 1
  const content = `  "${file}": {\n    "description": "",\n    "name": "${require(`../actions/${file}`).name}"\n  }${!isLast ? ',' : ''}\n`
  appendFileSync('master.json', content)
}

appendFileSync('master.json', '}')
