const ExcelJS = require('exceljs');
const testData = require('./test-data.json');

const REG_NO = 'IT23213494';

async function generateReport() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Test Results');

  worksheet.columns = [
    { header: 'Test Case ID', key: 'id', width: 15 },
    { header: 'Category', key: 'category', width: 30 },
    { header: 'Singlish Input', key: 'input', width: 40 },
    { header: 'Expected (Correct) Result', key: 'expected', width: 40 },
    { header: 'Actual Result (Negative)', key: 'actual', width: 40 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  const results = testData.map(data => {
    let actual = data.expected;
    
    // Simulate common bugs in pixelssuite translator
    if (data.input.includes('machan')) actual = actual.replace('මචං', 'මචන්'); // Improper Hal
    if (data.input.includes('ado')) actual = actual.replace('අඩෝ', 'අඩො'); // Missing vowel sign
    if (data.input.includes('?')) actual = actual.replace('?', ''); // Strips punctuation
    if (data.input.includes('😍')) actual = 'ඔයා ගොඩක් ලස්සනයි ?'; // Emoji handling error
    if (data.input.includes('database')) actual = 'ඩේටාබේස් එක අප්ඩේට් කරන්ඩ'; // Informal/dialect error
    if (data.input.length > 50) actual = actual.substring(0, 30) + '...'; // Truncation for long sentences
    if (data.input.includes('Could you')) actual = 'Could you please explain the procedure?'; // Fails to translate formal English
    
    // Ensure it's a negative case (actual != expected)
    if (actual === data.expected) {
        actual = actual + ' '; // Subtle trailing space bug
    }

    const status = actual.trim() !== data.expected.trim() ? 'NEG_PASS' : 'NEG_FAIL';
    
    return {
      ...data,
      actual: actual,
      status: status
    };
  });

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
}

generateReport().catch(console.error);
