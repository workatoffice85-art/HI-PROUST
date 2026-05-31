const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'admin.html');
let html = fs.readFileSync(filePath, 'utf8');

const lines = html.split('\n');
const stack = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  const regex = /<\/?(div|main|form)\b[^>]*>/gi;
  let match;
  while ((match = regex.exec(line)) !== null) {
    const tag = match[0];
    const isClose = tag.startsWith('</');
    const tagName = match[1].toLowerCase();
    
    if (!isClose) {
      const idMatch = tag.match(/id=["']([^"']+)["']/i);
      const classMatch = tag.match(/class=["']([^"']+)["']/i);
      const label = (idMatch ? `#${idMatch[1]}` : '') + (classMatch ? `.${classMatch[1]}` : '');
      stack.push({ lineNum, tagName, label });
      if (lineNum >= 720 && lineNum <= 950) {
        console.log(`[OPEN] Line ${lineNum}: <${tagName} ${label}>. Stack depth: ${stack.length}`);
      }
    } else {
      const last = stack.pop();
      if (lineNum >= 720 && lineNum <= 950) {
        console.log(`[CLOSE] Line ${lineNum}: </${tagName}>, closed <${last.tagName} ${last.label}> from line ${last.lineNum}. Stack depth: ${stack.length}`);
      }
      if (last.tagName !== tagName) {
        console.error(`MISMATCH on line ${lineNum}: Found </${tagName}>, but expected </${last.tagName}> to close <${last.tagName} ${last.label}> from line ${last.lineNum}`);
      }
    }
  }
}
