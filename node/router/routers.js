function registerRouter(app) {
  // app.use('/api', apiRouter);
  console.log('registerRouter');
  
  const defaultRouter = require('./default.js');
  app.use('/', defaultRouter);

  const apiRouter = require('./api.js');
  app.use('/api', apiRouter);

  const spiceRouter = require('./spice.js');
  app.use('/spice', spiceRouter);
  
  /*const websockifyRouter = require('./websockify.js');
  app.use('/websockify', websockifyRouter);*/
  
  const novncRouter = require('./novnc.js');
  app.use('/novnc', novncRouter);
}

module.exports = {
  registerRouter
};