const fs = require('fs');
const content = fs.readFileSync('script.js', 'utf8');
const lines = content.split('\n');

let braceCount = 0;
let minBrace = 0;
let minLine = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
    }
    
    if (braceCount < minBrace) {
        minBrace = braceCount;
        minLine = i + 1;
    }
}

console.log(`Final brace count: ${braceCount}`);
console.log(`Minimum brace count: ${minBrace} at line ${minLine}`);
console.log(`Need ${-braceCount} more closing braces`);
