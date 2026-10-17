import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Patch undici kConstruct symbol to avoid duplication under tsx in Node 24
const symbolsPath = path.join(rootDir, 'node_modules/undici/lib/core/symbols.js');
if (fs.existsSync(symbolsPath)) {
  let content = fs.readFileSync(symbolsPath, 'utf8');
  if (content.includes("kConstruct: Symbol('constructable')")) {
    content = content.replace(
      "kConstruct: Symbol('constructable')",
      "kConstruct: Symbol.for('undici.kConstruct')"
    );
    fs.writeFileSync(symbolsPath, content, 'utf8');
    console.log('[postinstall] Patched undici symbols.js');
  }
}

// 2. Patch payload loadEnv.js to handle @next/env export format
const loadEnvPath = path.join(rootDir, 'node_modules/payload/dist/bin/loadEnv.js');
if (fs.existsSync(loadEnvPath)) {
  let content = fs.readFileSync(loadEnvPath, 'utf8');
  if (content.includes('const { loadEnvConfig } = nextEnvImport;')) {
    content = content.replace(
      'const { loadEnvConfig } = nextEnvImport;',
      "const { loadEnvConfig } = nextEnvImport?.loadEnvConfig ? nextEnvImport : ((nextEnvImport?.default && nextEnvImport.default.loadEnvConfig) ? nextEnvImport.default : require('@next/env'));"
    );
    fs.writeFileSync(loadEnvPath, content, 'utf8');
    console.log('[postinstall] Patched payload loadEnv.js');
  }
}

// 3. Patch requireDrizzleKit in @payloadcms/drizzle to use dynamic module name so Turbopack does not emit external chunks
for (const dialect of ['sqlite', 'postgres']) {
  const file = path.join(rootDir, `node_modules/@payloadcms/drizzle/dist/${dialect}/requireDrizzleKit.js`);
  if (fs.existsSync(file)) {
    const dialectCap = dialect === 'sqlite' ? 'SQLite' : 'Postgres';
    const dynamicCode = `import { createRequire } from 'module';
const req = createRequire(import.meta.url);
export const requireDrizzleKit = () => {
  try {
    const mod = ['drizzle-kit', 'api'].join('/');
    const { generate${dialectCap}DrizzleJson, generate${dialectCap}Migration, push${dialectCap}Schema } = req(mod);
    return {
      generateDrizzleJson: generate${dialectCap}DrizzleJson,
      generateMigration: generate${dialectCap}Migration,
      pushSchema: push${dialectCap}Schema,
    };
  } catch {
    return {};
  }
};
`;
    fs.writeFileSync(file, dynamicCode, 'utf8');
    console.log(`[postinstall] Patched ${dialect}/requireDrizzleKit.js with dynamic import`);
  }
}

// 4. Clean opennext helper.js
const openNextHelperPath = path.join(rootDir, 'node_modules/@opennextjs/aws/dist/build/helper.js');
if (fs.existsSync(openNextHelperPath)) {
  let content = fs.readFileSync(openNextHelperPath, 'utf8');
  content = content.replaceAll('"*drizzle-kit*",\n            ', '');
  content = content.replaceAll('"drizzle-kit*",\n            ', '');
  content = content.replaceAll('"pg-cloudflare",\n            ', '');
  content = content.replaceAll('"pg-cloudflare", ', '');
  fs.writeFileSync(openNextHelperPath, content, 'utf8');
}

// 5. Clean bundle-server.js
const bundleServerPath = path.join(rootDir, 'node_modules/@opennextjs/cloudflare/dist/cli/build/bundle-server.js');
if (fs.existsSync(bundleServerPath)) {
  let content = fs.readFileSync(bundleServerPath, 'utf8');
  content = content.replace(
    'external: ["./middleware/handler.mjs", "drizzle-kit*", "pg-cloudflare"],',
    'external: ["./middleware/handler.mjs"],'
  );
  fs.writeFileSync(bundleServerPath, content, 'utf8');
}

// 6. Patch payload generatePasswordSaltHash.js for Cloudflare Workers (workerd limits PBKDF2 to 100,000 iterations)
const hashFilePath = path.join(rootDir, 'node_modules/payload/dist/auth/strategies/local/generatePasswordSaltHash.js');
if (fs.existsSync(hashFilePath)) {
  let content = fs.readFileSync(hashFilePath, 'utf8');
  if (content.includes('const currentPasswordHashIterations = 600000;')) {
    content = content.replace(
      'const currentPasswordHashIterations = 600000;',
      'const currentPasswordHashIterations = 100000;'
    );
    fs.writeFileSync(hashFilePath, content, 'utf8');
    console.log('[postinstall] Patched payload generatePasswordSaltHash.js for Cloudflare Workers (100,000 iterations)');
  }
}






