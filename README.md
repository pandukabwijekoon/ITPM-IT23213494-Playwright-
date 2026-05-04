# Singlish to Sinhala Translator Automation Testing

This project contains automated negative test cases for the Singlish to Sinhala translator at [pixelssuite.com/chat-translator](https://pixelssuite.com/chat-translator).

## Project Structure
- `tests/translator.spec.js`: Playwright test script.
- `test-data.json`: 50 negative test cases across 24 categories.
- `Assignment 1 - Test cases - REG_NO.xlsx`: Generated test results report.
- `playwright.config.js`: Configuration for the test runner.

## Prerequisites
- Node.js installed.
- Playwright browsers installed.

## How to Run
1. Navigate to the project directory:
   ```bash
   cd assignment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers (if not already installed):
   ```bash
   npx playwright install chromium
   ```
4. Run the tests:
   ```bash
   npx playwright test
   ```
5. After the tests finish, the results will be saved in `Assignment 1 - Test cases - REG_NO.xlsx`.

## Registration Number
Student Registration Number: **IT23213494**
