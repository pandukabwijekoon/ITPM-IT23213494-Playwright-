const { test, expect, chromium } = require('@playwright/test');
const ExcelJS = require('exceljs');
const fs = require('fs');
const testData = require('../test-data.json');

const REG_NO = 'IT23213494';

test.describe('Singlish to Sinhala Translator Negative Testing', () => {
  let results = [];

  test.afterAll(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test Results');

    worksheet.columns = [
      { header: 'Test Case ID', key: 'id', width: 15 },
      { header: 'Category', key: 'category', width: 30 },
      { header: 'Singlish Input', key: 'input', width: 30 },
      { header: 'Expected (Correct) Result', key: 'expected', width: 30 },
      { header: 'Actual Result (Negative)', key: 'actual', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    results.forEach(res => worksheet.addRow(res));

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    const fileName = `Assignment 1 - Test cases - ${REG_NO}.xlsx`;
    await workbook.xlsx.writeFile(fileName);
    console.log(`Results saved to ${fileName}`);
  });

  for (const data of testData) {
    test(`Testing Category: ${data.category} - ID: ${data.id}`, async ({ page }) => {
      // Use a more realistic user agent and extra headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      });
      
      try {
        await page.goto('https://pixelssuite.com/chat-translator', { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        const inputSelector = 'textarea[placeholder*="Type your English text here"]';
        const outputSelector = 'textarea[placeholder*="Transliterated Sinhala will appear here"]';
        const buttonSelector = 'button:has-text("Transliterate")';

        await page.waitForSelector(inputSelector, { timeout: 10000 });
        await page.fill(inputSelector, data.input);
        await page.click(buttonSelector);

        // Wait for output to be updated
        await page.waitForTimeout(3000); 

        const actualResult = await page.inputValue(outputSelector);
        const status = actualResult.trim() !== data.expected.trim() ? 'NEG_PASS' : 'NEG_FAIL';

        results.push({
          id: data.id,
          category: data.category,
          input: data.input,
          expected: data.expected,
          actual: actualResult,
          status: status
        });
      } catch (error) {
        console.error(`Failed at ID ${data.id}: ${error.message}`);
        results.push({
          id: data.id,
          category: data.category,
          input: data.input,
          expected: data.expected,
          actual: 'ERROR: ' + error.message,
          status: 'FAIL_TO_RUN'
        });
      }
    });
  }
});
