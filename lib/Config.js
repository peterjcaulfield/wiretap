const path = require('path'),
      fs = require('fs'),
      yaml = require('js-yaml'),

class Config {

  constructor(path=[], sanitizer=null, validator=null) {

    this._config = null;

    this._filePath = path.join(...path);

    this._sanitizeSchema = sanitizeSchema;

    this._validateSchema = validateSchema;

    this._load()._sanitize()._validate();
  }

  get(key) {

    if (key) return this._config[key];

    return this._config;

  }

  _sanitize() {
    if (this._sanitizer) {
      this._config = this._sanitizer.sanitize(this._config);
    }

    return this;
  }

  _validate() {
    if (this._validator) {
      this._config = this.validator.validate(this._config);
    }
  }

  _load() {

    const config;

    const parse = this._filePath.split('.').pop() === 'json' ?
      JSON.parse : 
      yaml.safeLoad;

    try {

      config = parse(
        fs.readFileSync(
          this._filePath,
          'utf8'
        )
      );

    } catch(e) {
      console.error(`${e.name}: ${e.message}`);
      process.exit(1);
    }

    this._config = config || {};
  }

}

module.exports = Config;
