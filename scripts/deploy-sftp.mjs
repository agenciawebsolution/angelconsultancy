import SftpClient from 'file:///D:/Projetos-GitHub/angelconsultancy/node_modules/ssh2-sftp-client/src/index.js';
import fs from 'fs';
import path from 'path';

// Load credentials from FileZilla XML
const filezillaPath = path.join(process.env.APPDATA, 'FileZilla', 'sitemanager.xml');
if (!fs.existsSync(filezillaPath)) {
  console.error('FileZilla sitemanager.xml not found');
  process.exit(1);
}

const xmlContent = fs.readFileSync(filezillaPath, 'utf8');
const serverBlockMatch = xmlContent.match(/<Server>[\s\S]*?<Name>ANGEL<\/Name>[\s\S]*?<\/Server>/);
if (!serverBlockMatch) {
  console.error('ANGEL server block not found in FileZilla XML');
  process.exit(1);
}

const serverBlock = serverBlockMatch[0];
const pass = Buffer.from(serverBlock.match(/<Pass[^>]*>([^<]+)<\/Pass>/)[1], 'base64').toString('utf8');
const username = serverBlock.match(/<User>([^<]+)<\/User>/)[1];
const host = serverBlock.match(/<Host>([^<]+)<\/Host>/)[1];
const port = parseInt(serverBlock.match(/<Port>([^<]+)<\/Port>/)[1], 10);

const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist! Please run npm run build first.');
  process.exit(1);
}

// Protected files/directories that should NEVER be overwritten or deleted on production
const PROTECTED_REL_PATHS = [
  'api/config.php',
  'api/config.local.php',
];

function getAllFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const relPath = path.join(base, file).replace(/\\/g, '/');
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results.push({ type: 'dir', relPath, absPath: filePath });
      results = results.concat(getAllFiles(filePath, relPath));
    } else {
      results.push({ type: 'file', relPath, absPath: filePath, size: stat.size });
    }
  }
  return results;
}

async function deploy() {
  console.log('--- STARTING DEPLOYMENT TO PRODUCTION (one.com) ---');
  console.log(`Target: ${host}:${port} as ${username}`);

  const sftp = new SftpClient();
  try {
    await sftp.connect({
      host,
      port,
      username,
      password: pass,
      readyTimeout: 30000
    });
    console.log('Connected to SFTP server.');

    const allItems = getAllFiles(distDir);
    const dirs = allItems.filter(i => i.type === 'dir');
    const files = allItems.filter(i => i.type === 'file');

    // 1. Ensure all directories exist on remote
    for (const d of dirs) {
      const remoteDirPath = d.relPath;
      const exists = await sftp.exists(remoteDirPath);
      if (!exists) {
        console.log(`Creating remote directory: ${remoteDirPath}`);
        await sftp.mkdir(remoteDirPath, true);
      }
    }

    // 2. Upload files
    let uploadedCount = 0;
    let skippedCount = 0;

    for (const f of files) {
      if (PROTECTED_REL_PATHS.includes(f.relPath)) {
        console.log(`[PROTECTED - SKIPPED] ${f.relPath}`);
        skippedCount++;
        continue;
      }

      // Skip empty placeholder files in uploads folder
      if (f.relPath.startsWith('uploads/') && f.size === 0) {
        skippedCount++;
        continue;
      }

      const remotePath = f.relPath;
      await sftp.fastPut(f.absPath, remotePath);
      uploadedCount++;
      console.log(`[UPLOADED] ${f.relPath} (${f.size} bytes)`);
    }

    console.log(`\nDeployment completed successfully! Uploaded ${uploadedCount} files, skipped ${skippedCount} protected items.`);
    await sftp.end();
  } catch (err) {
    console.error('Deployment error:', err.message);
    process.exit(1);
  }
}

deploy();
