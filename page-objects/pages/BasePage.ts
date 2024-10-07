import { Page } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string) {
        await this.page.goto(url);
    }

    // Utility function to convert RGB to HEX
    rgbToHex(rgb: string) {
        const rgbArray = rgb.match(/\d+/g)!.map(Number);
        return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
    }
}
