import assert from "node:assert";
import { By, until, WebDriver } from "selenium-webdriver";
import { delay } from "../tools";

export class KittenGamePage {
  protected driver: WebDriver;

  get catnipButton() {
    return By.css("td:nth-child(1) .btnContent");
  }
  get loadingContainer() {
    return By.css("#loadingContainer");
  }

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  waitForLoadComplete() {
    return this.driver.wait(
      until.elementIsNotVisible(this.driver.findElement(this.loadingContainer)),
      30000
    );
  }
  async waitForLoadStart() {
    await this.driver.wait(until.elementLocated(this.loadingContainer), 30000);
  }

  async testGatherCatnip() {
    await this.driver.wait(until.elementLocated(this.catnipButton), 3000);
    await this.driver.findElement(this.catnipButton).click();

    const resAmountLocator = By.css(".resAmount");
    await this.driver.wait(until.elementLocated(resAmountLocator), 30000);
    assert((await (await this.driver.findElement(resAmountLocator)).getText()) == "1");
  }

  async wipe() {
    await this.driver.findElement(By.id("wipe-link")).click();
    assert(
      (await this.driver.switchTo().alert().getText()) ==
        "All save data will be DESTROYED, are you sure?"
    );
    await this.driver.switchTo().alert().accept();
    assert((await this.driver.switchTo().alert().getText()) == "Are you ABSOLUTELY sure?");
    await this.driver.switchTo().alert().accept();
    await delay(1000);
    await this.waitForLoadStart();
  }
}
