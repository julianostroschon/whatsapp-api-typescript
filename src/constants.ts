const version = require('../package.json').version;
const [API_VERSION] = version


const URL_PREFIX = `/api/v${API_VERSION}/`;

export { version, URL_PREFIX }