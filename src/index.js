const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const { XXHash64, XXHash128 } = require('xxhash-addon');
const { name } = require('../package.json');

function getXxh128(seed) {
  const xxh64 = new XXHash64();
  xxh64.update(Buffer.from(seed));
  const xxh128 = new XXHash128(xxh64.digest());
  return xxh128;
}

function generateMetaFile(file, guid, isDirectory = false) {
  core.info(`Generating meta file for ${file}...`);
  let template = `fileFormatVersion: 2
guid: {${guid.toString('hex')}}`;
  if (isDirectory) {
    template = `${template}
folderAsset: yes
DefaultImporter:
  externalObjects: {}
  userData:
  assetBundleName:
  assetBundleVariant: `;
  } else {
    const extension = path.extname(file);
    switch (extension) {
      case '.json':
        if (file.endsWith('package.json')) {
          template = `${template}
PackageManifestImporter:
  externalObjects: {}
  userData:
  assetBundleName:
  assetBundleVariant: `;
        } else {
          template = `${template}
timeCreated: ${Math.round(Date.now() / 1000)}`;
        }
        break;
      case '.cs':
        template = `${template}
MonoImporter:
  externalObjects: {}
  serializedVersion: 2
  defaultReferences: []
  executionOrder: 0
  icon: {instanceID: 0}
  userData:
  assetBundleName:
  assetBundleVariant: `;
        break;
      case '.dll':
        template = `${template}
PluginImporter:
  externalObjects: {}
  serializedVersion: 2
  iconMap: {}
  executionOrder: {}
  defineConstraints: []
  isPreloaded: 0
  isOverridable: 1
  isExplicitlyReferenced: 0
  validateReferences: 1
  platformData:
  - first:
      Any:
    second:
      enabled: 1
      settings: {}
  - first:
      Editor: Editor
    second:
      enabled: 0
      settings:
        DefaultValueInitialized: true
  - first:
      Windows Store Apps: WindowsStoreApps
    second:
      enabled: 0
      settings:
        CPU: AnyCPU
  userData:
  assetBundleName:
  assetBundleVariant:
`;
        break;
      default:
        template = `${template}
timeCreated: ${Math.round(Date.now() / 1000)}`;
        break;
    }
  }

  fs.writeFile(`${file}.meta`, template, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      throw err;
    }
    // file written successfully
  });
  core.info(`Meta file generated for ${file}`);
}

function processFile(file, xxh128) {
  core.info(`Processing ${file}...`);
  if (fs.existsSync(file) && !file.endsWith('.meta') && fs.existsSync(`${file}.meta`)) {
    xxh128.update(Buffer.from(file));
    const guid = xxh128.digest();
    xxh128.reset();

    generateMetaFile(file, guid);
  }
}

function processDirectory(file, xxh128) {
  xxh128.update(Buffer.from(file));
  const guid = xxh128.digest();
  xxh128.reset();

  generateMetaFile(file, guid, true);
}

function walkTree(directory) {
  const initSeed = core.getInput('seed') || name;
  const xxh128 = getXxh128(initSeed);

  const files = fs.readdirSync(directory);
  core.info(`Found ${files.length} files in ${directory}`);
  files.forEach((file) => {
    if (file.startsWith('.')) {
      core.info(`Skipping ${file}`);
      return;
    }
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      processFile(filePath, xxh128);
    } else if (stats.isDirectory()) {
      processDirectory(filePath, xxh128);
      walkTree(filePath);
    }
  });
}

function main() {
  core.info(`Scanning ${core.getInput('directory')} directory...`);
  const directory = core.getInput('directory') || './';
  walkTree(directory);
}

try {
  main();
} catch (error) {
  core.setFailed(error.message);
}
