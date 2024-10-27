import { expect, Locator, Page } from "@playwright/test";

export class GaragePage {
  readonly page: Page;
  readonly addNewCarButton: Locator;
  readonly brandDropdown: Locator;
  readonly modelDropdown: Locator;
  readonly mileageField: Locator;
  readonly addButton: Locator;
  readonly pageHeading: Locator;
  readonly lastCarName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addNewCarButton = page.getByText("Add car");
    this.brandDropdown = page.locator("#addCarBrand");
    this.modelDropdown = page.locator("#addCarModel");
    this.mileageField = page.locator("#addCarMileage");
    this.addButton = page.getByText("Add", { exact: true });
    this.pageHeading = page.getByRole("heading", { name: "Garage" });
    this.lastCarName = page.locator(".car_name").first();
  }

  async open() {
    await this.page.goto("/panel/garage");
  }

  async verifyPageIsOpen() {
    await expect(this.pageHeading).toBeVisible();
  }

  async addNewCar(brand: string, model: string, mileage: string) {
    await this.addNewCarButton.click();
    await this.brandDropdown.selectOption(brand);
    await this.modelDropdown.selectOption(model);
    const color = await this.addButton.getAttribute("class");
    await this.mileageField.fill(mileage);
    await this.addButton.click();
  }

  async verifyLastAddedCarName(name: string) {
    await expect(this.lastCarName).toHaveText(name);
  }
}
