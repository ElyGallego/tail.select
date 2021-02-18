
const readline = require('readline');

/*
 |  FACTORY FUNCTION RETURNING AN ASYNC GENERATOR
 |  @magic-done-by  https://www.npmjs.com/package/zora-tap-reporter
 */
const map = (fn) => async function* (stream) {
    for await (const m of stream) {
        yield fn(m);
    }
};

/*
 |  FLATTENER FUNCTION RETURNING AN ASYNC GENERATOR
 |  @magic-done-by  https://www.npmjs.com/package/zora-tap-reporter
 */
const flatten = map((m) => {
    m.offset = 0;
    return m;
});

/*
 |  DEFINE TAP REPORTER
 */
class RatZoraReporter {
    /*
     |  CONSTRUCTOR
     */
    constructor(config) {
        this.title = [];

        this.passed = 0;
        this.skipped = 0;
        this.failed = 0;

        this.dots = [[]];
        this.dotsRow = 0;
        
        this.screen = process.stdout;
        this.drawnLines = 0;
    }
    
    /*
     |  REPORT :: 
     */
    async report(stream) {
        const src = flatten(stream);
        
        let lastMessage = null;
        for await (const message of src) {
            lastMessage = message;
            switch (message.type) {
                case "TEST_START":
                    this.printTestStart(message);
                    break;
                case "ASSERTION":
                    this.printAssertion(message);
                    break;
                case "BAIL_OUT":
                    this.printBailOut(message);
                    break;
            }
            this.print(`1..${lastMessage.data.count}`, 0);
            this.printSummary(lastMessage);
        }
        this.printSummary(lastMessage);
    }

    /*
     |  PRINT :: 
     */
    printTestStart(message) {
        const { data: { description } } = message;
        this.title[0] = description;
    }

    /*
     |  PRINT :: 
     */
    printAssertion(message) {
        const { data, offset } = message;
        const { pass, description } = data;
        const label = pass === true ? 'ok' : 'not ok';

        if (this.dots[this.dotsRow].length >= 40) {
            this.dotsRow++
            this.dots.push([]);
        }
        this.dots[this.dotsRow].push(pass? "\x1b[32m.\x1b[0m": "\x1b[31m,\x1b[0m");

        if (pass) {
            this.passed++;
        } else {
            this.failed++;
        }

        this.draw();
    }

    /*
     |  PRINT :: 
     */
    printBailOut(message) {
        //console.log(message);
    }

    /*
     |  PRINT :: 
     */
    print(message) {
        //console.log(message);
    }

    /*
     |  PRINT :: 
     */
    printSummary(message) {
    }

    /*
     |  PRINT :: GREEN DOT
     */
    draw() {
        if (this.drawnLines > 0) {
            process.stdout.moveCursor(0, -this.drawnLines);
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        }
        process.stdout.clearScreenDown()

        process.stdout.write(`\n\x1b[2mTask:\x1b[0m ${this.title[0]}             \x1b[32m\u2713\x1b[0m ${this.passed}  \x1b[31m\u2717\x1b[0m ${this.failed}\n`);
        for (let rows of this.dots) {
            process.stdout.write(rows.join('') + "\n");
        }
        this.drawnLines = 2 + this.dots.length;
    }
}

// Export Module
module.exports = ((config) => {
    const reporter = new RatZoraReporter(config);
    return async (stream) => reporter.report(stream);
});
