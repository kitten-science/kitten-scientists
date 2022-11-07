import "chromedriver";
import { Builder, WebDriver } from "selenium-webdriver";
import config from "../config";
import { KittenGamePage } from "../pages/KittenGamePage";

const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

describe("Smoke test", function () {
  let driver: WebDriver;
  let kg: KittenGamePage;
  let allPassed = true;

  before(async function () {
    if (username && accessKey) {
      driver = await new Builder()
        .usingServer(`http://${username}:${accessKey}@hub.browserstack.com/wd/hub`)
        .withCapabilities({
          "bstack:options": {
            buildName: process.env.BROWSERSTACK_BUILD_NAME,
            local: true,
            os: "Windows",
            osVersion: "11",
            projectName: "Kitten Scientists",
            sessionName: "Smoke tests",
          },
          "browserstack.appiumLogs": "true",
          "browserstack.console": "verbose",
          "browserstack.debug": "true",
          "browserstack.networkLogs": "true",
          "browserstack.networkLogsOptions": {
            captureContent: "true",
          },
          "browserstack.seleniumLogs": "true",
          "browserstack.video": "true",
          browserName: "Chrome",
          browserVersion: "103.0",
        })
        .build();
    } else {
      driver = await new Builder().forBrowser("chrome").build();
    }

    await driver.navigate().to(config.baseUrl);
    await driver.manage().window().setRect({ width: 1460, height: 1080 });
  });

  beforeEach(async function () {
    kg = new KittenGamePage(driver);

    await kg.waitForLoadComplete();
    await kg.wipe();
    await kg.waitForLoadComplete();
  });

  afterEach(function () {
    if (!this.currentTest) {
      return;
    }
    allPassed = allPassed && this.currentTest.state === "passed";
  });

  after(async () => {
    await driver.executeScript(
      `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${
        allPassed ? "passed" : "failed"
      }", "reason": "none"}}`
    );

    await driver.quit();
  });

  it("Gathers catnip", async function () {
    await kg.testGatherCatnip();
  });
});
