const calc = require('../utilities/testCaseCalc')
const timeout = 8000000
const domain = 'https://www.integral-calculator.ru/'

describe(
    'E2E tests',
    () => {
        let mainPage;

        beforeAll(
            async () => {
                try {
                    jest.setTimeout(30000)
                    mainPage = await calc.startTest(domain, false)
                }
                catch (error) {
                    console.log(error);
                    throw error;
                }
            }, timeout
        );

         it("Erroneous input provokes error",
            async () => {
                expect(await mainPage.isInputErroneous("test*///#ok")).toBe(true)
            }
         )

         it("Evaluate basic expression",
             async () => {
                 expect(await mainPage.evalExpression("x")).toBe(true)
             }, timeout
         )

         it("Link for English version works",
             async () => {
                expect(await mainPage.checkEnglishSite()).toBe(true)
             }
         )

        afterAll(
            async () => {
                await calc.endTest()
            }
        );
    }, timeout
);
