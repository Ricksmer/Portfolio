/**
 * Automated Dev-Time Parity Check
 * Verifies that 100% of items in content.json have corresponding renderers
 * in COMPONENT_REGISTRY for both Public/Render view and Edit view.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read content.json
const contentPath = path.resolve(__dirname, '../js/data/content.json');
const contentRaw = fs.readFileSync(contentPath, 'utf8');
const contentData = JSON.parse(contentRaw);

// Read componentRegistry.js
import { COMPONENT_REGISTRY } from '../js/modules/registry/componentRegistry.js';

console.log('--------------------------------------------------');
console.log('RUNNING DEV-TIME CONTENT & REGISTRY PARITY CHECK');
console.log('--------------------------------------------------');

let totalSections = 0;
let totalItems = 0;
let failedItems = 0;
const missingTypes = new Set();

if (!contentData.sections || !Array.isArray(contentData.sections)) {
  console.error('FAIL: content.json is missing valid sections array');
  process.exit(1);
}

contentData.sections.forEach((section, sIdx) => {
  totalSections++;
  console.log(`[SECTION ${sIdx + 1}] ID: ${section.id} | Spine: "${section.spineLabel}" | Items: ${section.items ? section.items.length : 0}`);

  if (!section.id || !section.slug || !section.spineLabel || !section.navLabel) {
    console.error(`  FAIL: Section at index ${sIdx} is missing required routing metadata!`);
    failedItems++;
  }

  (section.items || []).forEach((item, iIdx) => {
    totalItems++;
    const reg = COMPONENT_REGISTRY[item.type];

    if (!reg) {
      console.error(`  FAIL: Item ID "${item.id}" uses unregistered type "${item.type}"!`);
      missingTypes.add(item.type);
      failedItems++;
      return;
    }

    if (typeof reg.renderPublic !== 'function') {
      console.error(`  FAIL: Registry for type "${item.type}" is missing renderPublic function!`);
      failedItems++;
    }

    if (typeof reg.renderEditor !== 'function') {
      console.error(`  FAIL: Registry for type "${item.type}" is missing renderEditor function!`);
      failedItems++;
    }

    // Test renderPublic output
    try {
      const publicHtml = reg.renderPublic(item);
      if (!publicHtml || typeof publicHtml !== 'string') {
        console.error(`  FAIL: renderPublic for item "${item.id}" returned empty or non-string!`);
        failedItems++;
      }
    } catch (err) {
      console.error(`  FAIL: renderPublic crashed for item "${item.id}":`, err.message);
      failedItems++;
    }
  });
});

console.log('--------------------------------------------------');
console.log(`Audited Sections: ${totalSections}`);
console.log(`Audited Content Items: ${totalItems}`);
console.log(`Registered Component Types: ${Object.keys(COMPONENT_REGISTRY).length}`);
console.log(`Failures Detected: ${failedItems}`);

if (failedItems > 0) {
  console.error('PARITY CHECK FAILED! Missing types:', Array.from(missingTypes));
  process.exit(1);
} else {
  console.log('100% PARITY VERIFIED: All content items have valid public and editor renderers!');
  process.exit(0);
}
