var util = require('util');

var Markov = function(){
  this.wordPairs = {};
  this.firstWords = {};
  this.lastWords = {};
  this.words = {};
};

Markov.prototype.addSample = function(sample){
  var words = sample.split(/\s+/);
  var previousWord = '';
  var word = '';
  var firstWord = words[0].toLowerCase();
  this.firstWords[firstWord] = (this.firstWords[firstWord] || 0) + 1;
  while(word = words.shift()){
    word = word.toLowerCase();
    this.words[word] = (this.words[word] || 0) + 1;
    if(previousWord){
      this.wordPairs[previousWord] = this.wordPairs[previousWord] || {};
      this.wordPairs[previousWord][word] = (this.wordPairs[previousWord][word] || 0) + 1;
    }
    previousWord = word;
  }
  this.lastWords[previousWord] = (this.lastWords[previousWord] || 0) + 1;
};

Markov.prototype.nextWord = function(previousWord){
  var nextWords = this.wordPairs[previousWord] || this.words;
  return this.randomWord(nextWords);
};

Markov.prototype.firstWord = function(){
  var word = this.randomWord(this.firstWords);
  return word.charAt(0).toUpperCase() + word.slice(1);
};

Markov.prototype.lastWord = function(previousWord){
  return this.randomWord(this.lastWords);
};

Markov.prototype.randomWord = function(sourceList){
  var words = sourceList || this.words;
  var list = Object.keys(words);
  var sum = list.reduce(function(acc, val){
    return acc + words[val];
  }, 0);
  var rand = Math.floor(Math.random()*sum+1);
  var nextWord = '';
  var partialSum = 0;
  list.forEach(function(word){
    partialSum = partialSum + words[word];
    if(partialSum >= rand){
      nextWord = nextWord || word;
    }
  });
  return nextWord;
};

Markov.prototype.data = function(){
  var data = {
    words: this.words,
    firstWords: this.firstWords,
    lastWords: this.lastWords,
    wordPairs: this.wordPairs,
  };
  return data;
};

Markov.prototype.dump = function(segment, options){
  var opts = options || {};
  var data = this.data();
  if(segment){
    data = data[segment];
  }
  if(!opts.return){
    return console.log(JSON.stringify(data, null, 2));
  }
  return JSON.stringify(data, null, 2);
};

Markov.prototype.makeSentence = function(maxLength){
  var previousWord = this.firstWord(), word = '';
  var sentence = previousWord;
  var length = 0;
  previousWord = previousWord.toLowerCase();
  while(length<maxLength){
    word = this.nextWord(previousWord);
    sentence = sentence + ' ' + word;
    previousWord = word;
    if(/(\.|!|\?)$/.exec(sentence)){
      return sentence;
    }
    length++;
  }
  return sentence + ' ' + this.lastWord(previousWord);
};

module.exports = {
  Markov: Markov,
};
