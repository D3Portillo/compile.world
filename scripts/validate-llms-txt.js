#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateLlmsTxt(filePath) {
  console.log(`Validating ${filePath}...`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let isValid = true;
  const errors = [];

  // Check for required H1 title
  if (!lines[0] || !lines[0].startsWith('# ')) {
    errors.push('Missing required H1 title at the beginning');
    isValid = false;
  }

  // Check for blockquote summary
  const blockquoteIndex = lines.findIndex(line => line.startsWith('> '));
  if (blockquoteIndex === -1) {
    errors.push('Missing required blockquote summary');
    isValid = false;
  }

  // Check for H2 sections
  const h2Sections = lines.filter(line => line.startsWith('## '));
  if (h2Sections.length === 0) {
    errors.push('No H2 sections found');
    isValid = false;
  }

  // Check link format in sections
  let inSection = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      inSection = true;
      continue;
    }

    if (inSection && line.startsWith('- ')) {
      // Check if it's a valid markdown link
      const linkRegex = /^- \[.+\]\(.+\)(\s*:\s*.+)?$/;
      if (!linkRegex.test(line)) {
        errors.push(`Invalid link format at line ${i + 1}: ${line}`);
        isValid = false;
      }
    }
  }

  if (isValid) {
    console.log('✅ llms.txt format is valid!');
    console.log(`   - Title: ${lines[0]}`);
    console.log(`   - Has blockquote: ${blockquoteIndex !== -1}`);
    console.log(`   - Number of sections: ${h2Sections.length}`);
    console.log(`   - Sections: ${h2Sections.map(s => s.replace('## ', '')).join(', ')}`);
  } else {
    console.log('❌ llms.txt format has issues:');
    errors.forEach(error => console.log(`   - ${error}`));
  }

  return isValid;
}

function main() {
  const publicDir = path.join(process.cwd(), 'public');
  const llmsTxtPath = path.join(publicDir, 'llms.txt');
  const llmsFullTxtPath = path.join(publicDir, 'llms-full.txt');

  console.log('🔍 Validating llms.txt files...\n');

  const llmsTxtValid = validateLlmsTxt(llmsTxtPath);
  console.log('');

  // Basic validation for full version
  if (fs.existsSync(llmsFullTxtPath)) {
    const stats = fs.statSync(llmsFullTxtPath);
    console.log(`✅ llms-full.txt exists (${Math.round(stats.size / 1024)} KB)`);
  } else {
    console.log('❌ llms-full.txt not found');
  }

  console.log('\n' + (llmsTxtValid ? '🎉 All validations passed!' : '⚠️  Some validations failed'));
}

if (require.main === module) {
  main();
}

module.exports = { validateLlmsTxt };
