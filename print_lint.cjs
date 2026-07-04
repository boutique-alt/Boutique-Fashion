const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lint_results.json', 'utf8'));
data.filter(d => d.errorCount > 0 || d.warningCount > 0).forEach(d => {
  console.log(d.filePath);
  d.messages.forEach(m => console.log(`  Line ${m.line}: ${m.message} (${m.ruleId})`));
});
