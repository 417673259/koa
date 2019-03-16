import path from 'path';

const env = process.env.NODE_ENV;
export function SCRIPT(name) {
  if (env === 'development') {
    return `<script src=http://localhost:4000/assets/${name}.js></script>`;
  }
  try {
    const json = require(path.resolve('./dist/manifest.json'));
    const keys = Object.keys(json);
    let js = '';
    keys.forEach((item) => {
      if (item.indexOf('.js') > -1) {
        js += `<script src=${json[item]}></script>`;
      }
    });
    return js;
  } catch (err) {
    console.log(err);
  }
}

export function CSS(name) {
  if (env === 'development') {
    return '';
  }
  try {
    const json = require(path.resolve('./dist/manifest.json'));
    const keys = Object.keys(json);
    let css = '';
    keys.forEach((item) => {
      if (item.indexOf('.css') > -1) {
        css += `<link rel=stylesheet href=${json[item]} />`;
      }
    });
    return css;
  } catch (err) {
    console.log(err);
  }
}

export default (app) => {
  app.use(async (ctx, next) => {
    ctx.state.CSS = CSS;
    ctx.state.SCRIPT = SCRIPT;
    return next();
  });
};
