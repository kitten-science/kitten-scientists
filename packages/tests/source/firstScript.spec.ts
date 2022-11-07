import "chromedriver";
import { Builder, WebDriver } from "selenium-webdriver";
import config from "./config";
import { KittenGamePage } from "./pages/KittenGamePage";

describe("First script", function () {
  let driver: WebDriver;
  let kg: KittenGamePage;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
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
