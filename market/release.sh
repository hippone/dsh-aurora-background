#!/bin/sh
# Publish the current version to npm, repoint the market index at it, and push.
#
# npm enables write 2FA on this account, so `npm publish` asks for the one-time
# code in this terminal — run it yourself instead of through an agent.
#
#   sh market/release.sh
#
set -eu
cd "$(dirname "$0")/.."

name=$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('package.json','utf8')).name)")
version=$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('package.json','utf8')).version)")

echo "publishing ${name}@${version} to npm (2FA prompt may follow)"
npm publish --access public

node market/build-index.mjs --source npm

git add market/index.json
git commit -m "index: ${name}@${version} from npm"
git push

echo
echo "published and indexed:"
echo "  https://www.npmjs.com/package/${name}"
echo "  https://raw.githubusercontent.com/hippone/dsh-aurora-background/main/market/index.json"
