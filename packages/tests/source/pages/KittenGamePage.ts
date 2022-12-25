import assert from "node:assert";
import { Alert, By, until, WebDriver } from "selenium-webdriver";
import { delay } from "../tools";

export class KittenGamePage {
  protected driver: WebDriver;

  get catnipButton() {
    return By.css("td:nth-child(1) .btnContent");
  }
  get refineCatnipButton() {
    return By.css("td:nth-child(1) .btnContent");
  }
  get catnipFieldButton() {
    return By.css(".btn:nth-child(2) .btnContent");
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
    await this.driver.wait(until.elementLocated(this.loadingContainer), 15000);
  }

  async testGatherCatnip() {
    await this.driver.wait(until.elementLocated(this.catnipButton), 3000);
    await this.driver.findElement(this.catnipButton).click();

    const resAmountLocator = By.css(".resAmount");
    await this.driver.wait(until.elementLocated(resAmountLocator), 3000);
    assert((await (await this.driver.findElement(resAmountLocator)).getText()) == "1");
  }

  async testBuildField() {
    await this.driver.wait(until.elementLocated(this.catnipButton), 3000);
    let clicksFailed = 0;
    for (let fieldCount = 0; fieldCount < 10; ) {
      try {
        await this.driver.findElement(this.catnipButton).click();
        await delay(100);
        ++fieldCount;
      } catch (error) {
        if (10 < ++clicksFailed) {
          throw error;
        }
      }
    }

    await this.driver.findElement(this.catnipFieldButton).click();
    const buttonTitle = By.css(".btn:nth-child(2) .btnTitle");
    await delay(1000);
    await this.driver.wait(until.elementLocated(buttonTitle), 3000);
    assert((await (await this.driver.findElement(buttonTitle)).getText()) == "Catnip Field (1)");
  }

  async wipe() {
    await this.driver.findElement(By.id("wipe-link")).click();

    // Wait for confirm()
    await this.waitForAlert();
    assert(
      (await this.driver.switchTo().alert().getText()) ==
        "All save data will be DESTROYED, are you sure?"
    );
    await this.driver.switchTo().alert().accept();

    // Wait for second confirm()
    await this.waitForAlert();
    assert((await this.driver.switchTo().alert().getText()) == "Are you ABSOLUTELY sure?");
    await this.driver.switchTo().alert().accept();

    await delay(1000);
    await this.waitForLoadStart();
  }

  async waitForAlert(): Promise<Alert> {
    try {
      const alert = await this.driver.switchTo().alert();
      return alert;
    } catch (error) {
      // @ts-expect-error Error
      if (error.message === "no such alert") {
        await delay(1000);
        return this.waitForAlert();
      }
      throw error;
    }
  }
}
