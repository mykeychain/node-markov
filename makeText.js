/** Command-line tool to generate Markov text. */

const fsP = require('fs/promises');
const axios = require('axios');
const { MarkovMachine } = require('./markov');

async function readFile(path) {
  try {
    let contents = await fsP.readFile(`${path}`, "utf8");
    return contents;

  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

async function readWeb(path) {
  try {
    let resp = await axios.get(path);
    return resp.data;

  } catch (err) {
    console.log("hello",err.message);
    process.exit(1);
  }
}

async function readFileorWeb(path) {
  let content = process.argv[2] === 'url'
  ? await readWeb(path)
  : await readFile(path);
  
  return content;

}

async function start() {
  let contents = await readFileorWeb(process.argv[3]);
  let markov = new MarkovMachine(contents);
  console.log(markov.getText());
}

start();