const axios = require('axios');
const fs = require('fs')
const shell = require('shelljs');

const LAST_DEPLOY_VERSION_FILENAME = 'last-deploy-version.txt'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function updateLastVersion(version) {
  fs.writeFileSync(LAST_DEPLOY_VERSION_FILENAME, version)
}

function determineLastVersion() {
  let lastVersion = null
  if (fs.existsSync(LAST_DEPLOY_VERSION_FILENAME)) {
    lastVersion = fs.readFileSync(LAST_DEPLOY_VERSION_FILENAME, 'utf8')
  } else {
    const packageJson = JSON.parse(fs.readFileSync('package.json'))
    lastVersion = packageJson.version
    updateLastVersion(lastVersion)
  }
  return lastVersion
}

async function checkForVersionChange(lastVersion) {
  const res = await axios.get('https://raw.githubusercontent.com/ampp33/switch-thing/main/package.json')
  const packageJson = res.data
  const currentVersion = packageJson.version
  if(lastVersion != currentVersion) {
    return currentVersion
  }
}

async function deploy() {
  shell.exec('deployment-scripts/deploy.sh', { async: true, silent: true })
}

async function main() {
  let currentVersion = determineLastVersion()
  console.log(`current version: ${currentVersion}, checking for new versions in github...`)
  while (true) {
    const newVersion = await checkForVersionChange(currentVersion)
    if(newVersion) {
      console.log('new version detected!  deploying...')
      updateLastVersion(newVersion)
      deploy()
      currentVersion = newVersion
    }
    await sleep(5000)
  }
}

main()