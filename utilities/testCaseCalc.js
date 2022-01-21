const puppeteer = require("puppeteer");

class e2eCalculator {
    async startTest(domain, headlessStatus) {
        this.browser = await puppeteer.launch({ headless: headlessStatus });
        let page = await this.browser.newPage();
        page.setDefaultTimeout(1000 * 60 * 10);
        await page.setViewport({ width: 1920, height: 1080 })
        await page.goto(domain)
        return this.mainPage(page)
    }

    async mainPage(calcPage) {
        return {
            evalExpression: async(expression) => {
                await calcPage.waitFor(3000)
                await calcPage.waitForSelector('input[id=expression]', { visible: true });
                await calcPage.evaluate( () => document.getElementById("expression").value = "")
                await calcPage.type('input[id=expression]', expression, { delay: 200 });

                await calcPage.click('input[id=go]')
                await calcPage.waitForSelector('.calc-header', { visible: true });
                await calcPage.waitFor(1000)
                return true
            },

            isInputErroneous: async(input) => {
                await calcPage.waitFor(3000)
                await calcPage.waitForSelector('input[id=expression]', { visible: true });
                await calcPage.evaluate( () => document.getElementById("expression").value = "")
                await calcPage.type('input[id=expression]', input, { delay: 200 });

                const errMsg = await calcPage.$("p[id=error-message]")
                await calcPage.waitFor(1000)
                return errMsg != null
            },

            checkEnglishSite: async() => {
                await calcPage.waitFor(3000)
                const links = await calcPage.$$('a')
                await links[2].click()
                const [h1] = await calcPage.$$('h1')
                await calcPage.waitFor(1000)
                return h1 != null
            },

            reload: async(domain) => {
                await calcPage.goto(domain)
            },
        }
    }

    async endTest() {
        await this.browser.close();
    }

}
module.exports = new e2eCalculator()
