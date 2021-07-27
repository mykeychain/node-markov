/** Textual markov chain generator */

const fsP = require('fs/promises');

class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.chain = this.makeChains(words);
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains(words) {
    let chain = {};

    for (let i = 0; i < words.length; i++) {
      chain[words[i]] = (chain[words[i]] || []);
      chain[words[i]].push(words[i+1]);
    }

    return chain;
  }


  /** return random text from chains */

  getText(numWords = 100) {
    let words = [];

    while (words.length < 1) {
      let startingWords = Object.keys(this.chain);
      let startingIdx = Math.floor(Math.random() * startingWords.length);

      if (startingWords[startingIdx]) {
        words.push(startingWords[startingIdx]);
      }
    }
    

    while (words.length < numWords) {
      let key = words[words.length-1];
      let randomIdx = Math.floor(Math.random() * this.chain[key].length)
      let newWord = this.chain[key][randomIdx];

      if (newWord) {
        words.push(newWord);
      } else {
        break;
      } 
    }

    return words.join(" ");
  }
}

async function readMyFile(path) {
  try {
    let contents = await fsP.readFile(`./${path}`, "utf8");
    return contents;

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function start() {
  let contents = await readMyFile(process.argv[2]);
  let markov = new MarkovMachine(contents);
  console.log(markov.getText());
}

start();

module.exports = {
  MarkovMachine
}

