/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// Prevent .env files from being cached
const crypto = require('crypto');
const fs = require('fs');

let hash = crypto.createHash('sha256');
hash.update(fs.readFileSync('.env'));
const cacheVersion = hash.digest('hex');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  cacheVersion,
};
