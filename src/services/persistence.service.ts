import * as fs from 'fs'

export function append(text : string): void {
  fs.appendFile('teste.csv', text, (e) => { if (e) console.log(e) })
}

export function write(text : string): void {
  fs.writeFile('teste.csv', text, (e) => { if (e) console.log(e) })
}
