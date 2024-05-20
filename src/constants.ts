import { version, name } from '../package.json';
const [API_VERSION] = version

const URL_PREFIX = `/api/v${API_VERSION}/`;
const PROJECT_NAME = name

export { URL_PREFIX, PROJECT_NAME }