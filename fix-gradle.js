const { withGradleProperties, withSettingsGradle } = require('@expo/config-plugins');

module.exports = function withFixedGradle(config) {
  config = withGradleProperties(config, (config) => {
    config.modResults.push({
      type: 'property',
      key: 'kotlin.jvm.target.validation.mode',
      value: 'IGNORE'
    });
    return config;
  });
  return config;
};
