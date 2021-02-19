const { isReturnStatement } = require("typescript");

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
        this.title = ['Task:', ''];

        // Total Tests
        this.passed = 0;
        this.skipped = 0;
        this.failed = 0;
        this.tests = { };
        this.testsDone = [ ];
        this.testsQueue = [];

        // Total Dots
        this.dots = [[]];
        this.dotsRow = 0;
        
        // Draw Data
        this.screen = process.stdout;
        this.drawnLines = 0;

        // Development
        this.debug = [];
    }
    
    /*
     |  REPORT :: 
     */
    async report(stream) {
        const src = flatten(stream);
        
        let lastMessage = null;
        for await (const message of src) {
            lastMessage = message;
            // { type: 'TEST_START', data: { description: 'Hello World' }, offset: 0 }
            switch (message.type) {
                case "TEST_START":
                    this.handleTestStart(message);
                    break;
                case "ASSERTION":
                    this.handleAssertion(message);
                    break;
                case "BAIL_OUT":
                    this.handleBailOut(message);
                    break;
                case "TEST_END":
                    this.handleTestEnd(message);
                    break;
            }
        }
        this.handleSummary(lastMessage);
    }

    /*
     |  HANDLE :: TEST START
     */
    handleTestStart(message) {
        const { data: { description } } = message;
        if (typeof description === 'undefined' || description.length === 0) {
            return;
        }

        // Add Test
        this.title[1] = description;
        this.testsQueue.push(this.title);

        // Debug
        this.debug.push(`START: ${description}`);
    }

    /*
     |  HANDLE :: TEST START
     */
    handleTestEnd(message) {
        if (this.testsQueue.length === 0) {
            return;
        }

        const { data: { description } } = message;
        if (typeof description === 'undefined' || description.length === 0) {
            return;
        }

        // Remove Tests
        this.testsDone.push(this.testsQueue.pop());

        // Debug
        this.debug.push(`END: ${description}`);
    }

    /*
     |  HANDLE :: ASSERTION
     */
    handleAssertion(message) {
        if (this.testsQueue.length === 0) {
            return;
        }

        const { data: { pass, description, executionTime } } = message;
        if (typeof description === 'undefined' || typeof executionTime !== 'undefined') {
            return;
        }

        // Pass Dot
        if (this.dots[this.dotsRow].length >= 40) {
            this.dotsRow++
            this.dots.push([]);
        }
        this.dots[this.dotsRow].push(pass? "\x1b[32m.\x1b[0m": "\x1b[31m,\x1b[0m");

        // Count Test
        if (pass) {
            this.passed++;
        } else {
            this.failed++;
        }

        // Draw
        this.draw();

        // Debug
        this.debug.push(`ASSERT: ${description}`);
    }

    /*
     |  HANDLE :: BAIL OUT
     */
    handleBailOut(message) {
        if (this.testCurrent) {
            return;
        }
        const { data: { pass, description } } = message;

        // Debug
        this.debug.push(`BAIL OUT: ${description}`);
    }

    /*
     |  HANDLE :: SUMMARY
     */
    handleSummary(message) {
        this.title[0] = '';
        this.title[1] = 'Finished!';
        this.draw('summary');
    }

    /*
     |  DRAW
     */
    draw(view) {
        if (this.drawnLines > 0) {
            process.stdout.moveCursor(0, -this.drawnLines);
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        }
        process.stdout.clearScreenDown();

        process.stdout.write(`\n\x1b[2m${this.title[0]}\x1b[0m ${this.title[1]}             \x1b[32m\u2713\x1b[0m ${this.passed}  \x1b[31m\u2717\x1b[0m ${this.failed}\n`);
        for (let rows of this.dots) {
            process.stdout.write(rows.join('') + "\n");
        }
        this.drawnLines = 2 + this.dots.length;

        if (typeof view !== 'undefined') {

            process.stdout.write(this.debug.join('\n'));
        }

    }
}

// Export Module
module.exports = ((config) => {
    const reporter = new RatZoraReporter(config);
    return async (stream) => reporter.report(stream);
});
