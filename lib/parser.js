var EXPRESSIONS = require('./expressions').EXPRESSIONS;

var Parser = function(){
  this.line = -1;
  this.col = -1;
  this.offset = -1;
};

Parser.prototype.pos = function(){
  return {
    line: this.line,
    col: this.col,
    offset: this.offset,
  };
};

Parser.prototype.classify = function(symbol){
  return Object.keys(EXPRESSIONS).reduce(function(types, name){
    var exp = EXPRESSIONS[name];
    exp.lastIndex = 0;
    if(exp.exec(symbol)){
      return types.concat([name]);
    }
    return types;
  }, []);
};

Parser.prototype.calcNumLines = function(symbol){
  return symbol.split(/\r\n|\r|\n/).length-1;
};

Parser.prototype.next = function(source){
  var start = this.pos();
  EXPRESSIONS.TOKEN.lastIndex = start.offset;
  var token = EXPRESSIONS.TOKEN.exec(source);
  if(!token){
    return false;
  }
  this.offset = EXPRESSIONS.TOKEN.lastIndex;
  this.col = this.col + (this.offset - start.offset);
  var symbol = token[0];
  var types = this.classify(symbol);
  if(types.indexOf('NEW_LINE')>-1){
    this.line = this.line + this.calcNumLines(symbol);
    this.col = 1;
  }
  var end = this.pos();
  var info = {
    start: start,
    end: end,
    symbol: symbol,
    types: types,
  };
  return info;
};

Parser.prototype.parse = function(source){
  var tree = [];
  this.line = 1;
  this.col = 1;
  this.offset = 0;

  var token;
  while(token = this.next(source)){
    tree.push(token);
  }

  return tree;
};

Parser.prototype.dump = function(tree, options){
  var opts = options || {};
  var segment = opts.segment;
  if(segment){
    tree = tree[segment];
  }
  if(!opts.return){
    return console.log(JSON.stringify(tree, null, 2));
  }
  return JSON.stringify(tree, null, 2);
};

module.exports = {
  Parser: Parser,
};
