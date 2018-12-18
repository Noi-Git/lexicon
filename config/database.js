if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://noi:noi2008@ds249123.mlab.com:49123/lexidb'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/lexidb'}
}