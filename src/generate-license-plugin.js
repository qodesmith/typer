const path = require('path')
const fs = require('fs')
const pluginName = 'GenerateLicense'

class GenerateLicense {
  constructor(options) {
    this.template = options.template
    this.placeholders = options.placeholders || {}
    this.outputPath = options.outputPath
    this.outputName = options.outputName
  }

  apply(compiler) {
    compiler.hooks.run.tap(pluginName, compilation => {
      if (!this.template) return console.log('\nSkipping license generation...\n')
      console.log(`\nGenerating ${this.outputName}...`)

      const template = fs.readFileSync(this.template, 'utf8')
      const license = Object.keys(this.placeholders).reduce((content, placeholder) => {
        const value = this.placeholders[placeholder]
        return content.replace(new RegExp(`{{${placeholder}}}`, 'g'), value)
      }, template)

      fs.writeFileSync(`${this.outputPath}/${this.outputName}`, license, 'utf8')
      console.log('Generation complete!\n')
    })
  }
}

module.exports = GenerateLicense
