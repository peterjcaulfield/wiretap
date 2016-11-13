const path = require('path'),
      fs = require('fs'),
      yaml = require('js-yaml'),
      inspector = require('schema-inspector');

class Config {

  constructor(path=[], sanitizeSchema=null, validateSchema=null) {

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

    if (this._sanitizeSchema) {

      Object.keys(this._config).forEach(key => 
        this._config[key] = inspector.sanitize(
          this._sanitizeSchema, this._config[key]
          ).data;
      );

    }

    return this;
  }

  _validate() {

    if (this._validateSchema) {

      Object.keys(this._config).forEach(key => {

        const validation = inspector.validate(
          this._validateSchema, 
          this._config[key]
        );

        if (!validation.valid) {

          this._config[key] = {
            error: validation.format()
          };

        }

      });
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
