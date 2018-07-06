const antlr4 = require('antlr4');
const Java8Lexer = require('./Java8Lexer');
const Java8Parser = require('./Java8Parser');
const Java8Visitor = require('./Java8Visitor');
const zeroJava = (content) => {
    const chars = new antlr4.InputStream(content);
    const lexer = new Java8Lexer.Java8Lexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new Java8Parser.Java8Parser(tokens);
    parser.buildParseTrees = true;
    const tree = parser.compilationUnit();
    const pkg = parser.visitPackageDeclaration(tree);
    console.info(pkg);
};
module.exports = zeroJava;