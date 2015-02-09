
function ExecutionContext(agent) {
    this.running = false;
    this.callStack = [];
    this.functionContext = null;
    this.globalVariables = {};
    this.error = false;
    this.agent = agent;

    /**
     * Clears the current context and runs a program in the fresh context.
     *
     * @param {String} program  The program to run in a new context.
     */
    this.runProgram = function (program) {
        this.reset();
        this.runMethod(program);
    };

    /**
     * Resets the current context to a fresh context.
     */
    this.reset = function () {
        this.functionContext = null;
        this.callStack = [];
        this.globalVariables = {};
        this.running = false;
        this.error = false;
    };

    /**
     * Run the given program string as a method in this execution context. Used to start
     * running programs and to call methods from running programs.
     *
     * @param {String} program  The program to run as a method.
     */
    this.runMethod = function (program) {
        this.running = true;
        if (this.callStack.length >= 100) {
            this.onActionError("Too much recursion, cannot nest more than 100 programs.");
            return;
        }
        //push the current function context onto the stack, if there is one
        if (this.functionContext) {
            this.callStack.push(functionContext);
        }
        this.functionContext = {
            lines: program.split("\n"),
            currentLine: 0,
            loopStack: [],
            variables: {}
        };
    };

    /**
     * Removes the current method from the call stack.
     */
    this.stopMethod = function () {
        this.functionContext = this.callStack.pop();
        if (!this.functionContext) {
            this.reset();
        }
    };

    /**
     * Run the next line of the players program.
     *
     * @return boolean true if the program still has processing left to do
     */
    this.runNextLine = function () {
        if (this.functionContext.currentLine >= this.functionContext.lines.length) {
            if (this.functionContext.loopStack.length) {
                this.onActionError("Expected end of loop '}' but reached end of program");
                return false;
            }
            this.stopMethod();
            return true;
        }
        //skip over empty lines and lines containing only comments
        var currentLine = trimComments(this.functionContext.lines[this.functionContext.currentLine]);
        if (!currentLine.length) {
            this.functionContext.currentLine++;
            return true;
        }
        this.functionContext.currentLine++;
        try {
            this.runLine(currentLine);
        } catch(e) {
            if (e instanceof ProgrammingError) {
                this.onActionError(e.message);
            } else {
                console.log(e.stack);
                throw e;
            }
        }
        return true;
    };

    this.runLine = function (currentLine) {
        if (this.agent.agentType == 'player')console.log(" " + currentLine);
        var tokens = tokenize(currentLine);
        var action = tokens.shift();
        if (action.charAt(0) === '$' || action.charAt(0) === '@') {
            if (tokens.length != 2 || tokens[0] != '=') {
                throw new ProgrammingError('Assignment statments must be of the form "$variable = expression" or "@variable = expression".');
            }
            var variableName = $.trim(action.substring(1));
            var value = this.evaluateExpression(tokens[1])
            if (action.charAt(0) === '$') {
                this.globalVariables[variableName] = value;
            } else {
                this.functionContext.variables[variableName] = value;
            }
            return;
        }
        if (action == "runProgram") {
            if (tokens.length != 1) {
                throw new ProgrammingError('Expected exactly 1 parameter, found: ' + tokens.length);
            }
            var programName = this.evaluateExpression(tokens[0]);
            var $element = $('.js-program[programName="' + programName +'"]');
            if (!$element.length) {
                throw new ProgrammingError('You have no program named "' + programName +'".');
            }
            if ($element.length > 1) {
                throw new ProgrammingError('You have multiple programs named "' + programName +'".');
            }
            var program = $element.data('program');
            runMethod(program.text);
            return;
        }
        if (action == "try") {
            if (tokens.length != 1 || tokens[0] != '{') {
                throw new ProgrammingError("a try block must be of the form 'try {'");
            }
            //just add to the context to indicate we are another code block deeper
            this.functionContext.loopStack.push({'startingLine': this.functionContext.currentLine, 'isTryBlock': true, 'loops': 1});
            return;
        }
        if (action == "if") {
            if (tokens.length != 2 || tokens[1] != '{') {
                throw new ProgrammingError("if block must be of the form 'if expression {'");
            }
            var condition = tokens[0];
            if (this.evaluateExpression(condition)) {
                //just add to the context to indicate we are another code block deeper
                this.functionContext.loopStack.push({'startingLine': this.functionContext.currentLine, 'isIfBlock': true, 'loops': 1});
                return;
            } else {
                this.moveToClosingBracket();
                var closingLine = trimComments(this.functionContext.lines[this.functionContext.currentLine - 1]);
                if (closingLine == '} else {') {
                    this.functionContext.loopStack.push({'startingLine': this.functionContext.currentLine, 'loops': 1});
                }
                return;
            }
        }
        if (action == "while") {
            if (tokens.length != 2 || tokens[1] != '{') {
                throw new ProgrammingError("while loop must be of the form 'while expression {'");
            }
            var condition = tokens[0];
            if (this.evaluateExpression(condition)) {
                this.functionContext.loopStack.push({'startingLine': this.functionContext.currentLine, 'condition': condition});
                return;
            } else {
                this.moveToClosingBracket();
                return;
            }
        }
        if (action == "loop") {
            if (tokens.length != 2 || tokens[1] != '{') {
                throw new ProgrammingError("Loops must be of the form 'loop expression {'");
            }
            var amount = this.evaluateExpression(tokens[0]);
            if (isNaN(amount) || amount < 1) {
                throw new ProgrammingError("Loop number must be a value 1 or greater, but found value: " + amount);
            }
            this.functionContext.loopStack.push({'startingLine': this.functionContext.currentLine, 'loops': amount});
            return;
        }
        if (action == '}') {
            if (!this.functionContext.loopStack.length) {
                throw new ProgrammingError("Found '}' with no matching '{'");
            }
            if (tokens.length == 0) {
                var loopDetails = this.functionContext.loopStack[this.functionContext.loopStack.length - 1];
                if (loopDetails.condition) {
                    //while loop
                    if (!this.evaluateExpression(loopDetails.condition)) {
                        this.functionContext.loopStack.pop();
                    } else {
                        this.functionContext.currentLine = loopDetails.startingLine;
                    }
                } else {
                    //basic loop
                    loopDetails.loops--;
                    if (!loopDetails.loops) {
                        this.functionContext.loopStack.pop();
                    } else {
                        this.functionContext.currentLine = loopDetails.startingLine;
                    }
                }
                return;
            }
            //if not just a '}' it is either a '} else {' or  '} catch {' line
            if (tokens.length > 2 || tokens[1] != '{' || (tokens[0] != 'else' && tokens[0] != 'catch')) {
                throw new ProgrammingError("'}' must appear on a line by itself or as part of either '} else {' or '} catch {'");
            }
            if (tokens[0] == 'catch') {
                var tryBlockData = this.functionContext.loopStack.pop();
                if (!tryBlockData.isTryBlock) {
                    throw new ProgrammingError("Found '} catch {' with no matching 'try {'");
                }
                //if we read the catch line, that means we finished the try block
                //with no errors, so we should skip it.
                this.moveToClosingBracket();
                return;
            }
            if (tokens[0] == 'else') {
                var ifBlockData = this.functionContext.loopStack.pop();
                if (!ifBlockData.isIfBlock) {
                    throw new ProgrammingError("Found '} catch {' with no matching 'if expression {'");
                }
                //if we read the else line, that means we were in the if body so we
                //should skip the else body
                this.moveToClosingBracket();
                return;
            }
        }
        var actionMethod = this.agent.getActionMethod(action, this.agent);
        if (!actionMethod) {
            throw new ProgrammingError("uknown action '" + action+ "'");
        }
        //evaluate all expressions before sending them to the action
        //console.log("before: " + JSON.stringify(tokens));
        for (var i = 0; i < tokens.length; i++) {
            tokens[i] = this.evaluateExpression(tokens[i]);
        }
        //console.log("after: " + JSON.stringify(tokens));
        actionMethod(tokens, this.agent);
    };

    this.evaluateExpression = function (expression) {
        expression = $.trim(expression);
        if (expression.charAt(0) == '(') {
            var parts = tokenize(expression.substring(1, expression.length - 1));
            if (parts.length == 1) {
                return this.evaluateExpression(parts[0]);
            }
            if (parts.length == 3) {
                var A = this.evaluateExpression(parts[0]);
                var B = this.evaluateExpression(parts[2]);
                return runOperation(A, parts[1], B);
            }
            throw new ProgrammingError("Invalid expression: '" + expression + "'.");
        }
        var parts = expression.split('.');
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (part.charAt(0) == '$' || part.charAt(0) == '@') {
                var name = part.substring(1);
                parts[i] = part.charAt(0) == '$'
                    ? ifseta(this.globalVariables, name, 0)
                    : this.getLocalVariable(name);
            }
        }
        //If a line started with a ., assume it is a float and remove the extra
        //element it generated and attach the '.' back to the next element.
        if (parts[0].length == 0) {
            parts.shift();
            parts[0] = '.' + parts[0];
        }
        //console.log("expression " + expression);
        if (parts.length > 1) {
            parts = expression.split('.');
            return this.resolveContextValue(parts, this.agent.contextValues);
        }
        var value = parts[0];
        var number = parseFloat(value);
        if (!isNaN(number)) {
            return number;
        }
        //just assume the expression is a string otherwise
        return value;
    };

    this.resolveContextValue = function (parts, contextValues) {
        if (typeof contextValues[parts[0]] == 'undefined') {
            throw new ProgrammingError("Attempted to read undefined address: '" + parts[0] + "'.");
        }
        if (typeof contextValues[parts[0]] == 'object') {
            return this.resolveContextValue (parts.slice(1), contextValues[parts[0]]);
        }
        if (typeof contextValues[parts[0]] == 'function') {
            var value = contextValues[parts[0]](parts.slice(1));
            return value;
        }
        return contextValues[parts[0]];
    };

    this.getLocalVariable = function (name) {
        var context = this.programContext;
        var stackIndex = this.callStack.length;
        while (stackIndex >= 0) {
            if (typeof context.variables[name] != 'undefined') {
                return context.variables[name];
            }
            context = this.callStack[--stackIndex];
        }
        return 0;
    };

    this.moveToClosingBracket = function () {
        //assuming we are starting on the line after the bracket opened
        var bracketDepth = 1;
        var currentLineNumber = this.functionContext.currentLine;
        while (currentLineNumber < this.functionContext.lines.length) {
            var currentLine = trimComments(this.functionContext.lines[currentLineNumber]);
            if (currentLine.indexOf('}') >= 0) {
                bracketDepth--;
                if (bracketDepth <= 0) {
                    this.functionContext.currentLine = currentLineNumber + 1;
                    return;
                }
            }
            if (currentLine.indexOf('{') >= 0 ) {
                bracketDepth++;
            }
            currentLineNumber++
        }
        this.onActionError("Mismatched brackets, found more '{' than '}'");
    };

    this.onActionError = function (errorMessage) {
        var currentFunctionContext = this.functionContext;
        //check the current call stack for any try blocks. If any are found
        //we proceed to the end of that block and continue execution
        while (this.functionContext) {
            while (this.functionContext.loopStack.length) {
                var blockDetails = this.functionContext.loopStack.pop();
                if (blockDetails.isTryBlock) {
                    this.functionContext.currentLine = blockDetails.startingLine;
                    this.moveToClosingBracket();
                    var closingLine = trimComments(this.functionContext.lines[this.functionContext.currentLine - 1]);
                    if (closingLine == '} catch {') {
                        this.functionContext.loopStack.push({'startingLine': this.functionContext.currentLine, 'loops': 1});
                    }
                    return;
                }
            }
            this.functionContext = this.callStack.pop();
        }
        this.reset();
        this.error = true;
        if (currentFunctionContext) {
            alert('error on line ' + currentFunctionContext.currentLine + " (" + currentFunctionContext.lines[currentFunctionContext.currentLine - 1] + "): " + errorMessage);
        } else {
            alert('programming error caught outside of program context: ' + errorMessage);
        }
    };
}