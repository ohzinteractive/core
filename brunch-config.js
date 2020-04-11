let load_json = (file_path) => {
  return require(file_path);
}

exports.config = {
  files: {
    javascripts: {
      entryPoints: {
        'src/api.js': 'index.js'
      }
    },
    stylesheets: {
      joinTo: 'app.css'
    },
    templates: {
      joinTo: 'app.js'
    }
  },
  paths: {
    public: '.',
    watched: ['src']
  },
  plugins: {
    babel: {
      ignore: [/vendor/],
      presets: ['latest']
    },
    pug: {
      locals: {
      }
    }
  }
}
