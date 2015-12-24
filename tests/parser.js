var Parser = require('../').Parser;

var source = 'William Shakespeare was an English poet, playwright, and actor, widely regarded as the greatest writer in the English language and the world\'s pre-eminent dramatist. He is often called England\'s national poet, and the Bard of Avon. His extant works, including collaborations, consist of approximately 38 plays, 154 sonnets, two long narrative poems, and a few other verses, some of uncertain authorship. His plays have been translated into every major living language and are performed more often than those of any other playwright.';
//var source = 'test\'s'

var parser = new Parser();
var tree = parser.parse(source);
parser.dump(tree);
console.log(source);
