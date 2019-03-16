import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';

export function getRouters() {
  if (isDev) {
    const routers = require(path.resolve('src/client/routers'));
    return routers.default;
  }
  return require('../../temp/client/routers').default;
}

export function getReducer() {
  if (isDev) {
    const routers = require(path.resolve('src/client/reduce'));
    return routers.default;
  }
  return require('../../temp/client/reduce').default;
}
