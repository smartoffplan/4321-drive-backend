try {
  require('./src/app.js');
  console.log('App loads successfully with Swagger');
} catch (e) {
  console.error('LOAD ERROR:', e.message);
  console.error(e.stack);
}
