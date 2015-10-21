var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SyntaxKind = require('./utils/SyntaxKind');
var ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var noDeleteExpression = new NoDeleteExpression(sourceFile, this.getOptions());
        return this.applyWithWalker(noDeleteExpression);
    };
    Rule.FAILURE_STRING = 'Variables should not be deleted: ';
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var NoDeleteExpression = (function (_super) {
    __extends(NoDeleteExpression, _super);
    function NoDeleteExpression() {
        _super.apply(this, arguments);
    }
    NoDeleteExpression.prototype.visitExpressionStatement = function (node) {
        _super.prototype.visitExpressionStatement.call(this, node);
        if (node.expression.kind === SyntaxKind.current().DeleteExpression) {
            var deletedObject = node.expression.getChildren()[1];
            if (deletedObject.kind === SyntaxKind.current().ElementAccessExpression) {
                var deletedExpression = deletedObject.expression;
                if (deletedExpression.kind !== SyntaxKind.current().PropertyAccessExpression) {
                    this.addNoDeleteFailure(deletedObject);
                }
            }
            else if (deletedObject.kind !== SyntaxKind.current().PropertyAccessExpression) {
                this.addNoDeleteFailure(deletedObject);
            }
        }
    };
    NoDeleteExpression.prototype.addNoDeleteFailure = function (deletedObject) {
        var msg = Rule.FAILURE_STRING + deletedObject.getFullText().trim();
        this.addFailure(this.createFailure(deletedObject.getStart(), deletedObject.getWidth(), msg));
    };
    return NoDeleteExpression;
})(ErrorTolerantWalker);
//# sourceMappingURL=noDeleteExpressionRule.js.map