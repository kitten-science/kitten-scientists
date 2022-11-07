import "chromedriver";
import { Builder, WebDriver } from "selenium-webdriver";
import config from "../config";
import { KittenGamePage } from "../pages/KittenGamePage";

const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

describe("Smoke test", function () {
  let driver: WebDriver;
  let kg: KittenGamePage;

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
          browserName: "Chrome",
          browserVersion: "103.0",
        })
        .build();
    } else {
      driver = await new Builder().forBrowser("chrome").build();
    }

    await driver.navigate().to(config.baseUrl);
  });

  beforeEach(async function () {
    kg = new KittenGamePage(driver);

    await kg.waitForLoadComplete();
    await kg.wipe();
    await kg.waitForLoadComplete();
  });

  after(async () => await driver.quit());

  it("Gathers catnip", async function () {
    await kg.testGatherCatnip();
  });
});
