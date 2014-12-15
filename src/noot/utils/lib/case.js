var Utils = {
  dasherize: function(str) {
    return (str || '')
      .toString()
      .split('')
      .map(function(part) {
        return /[a-z]/.test(part) ?
               part : /[A-Z]/.test(part) ?
                      '-' + part :
                      '-';

      })
      .join('')
      .toLowerCase()
      .replace(/-{2,}/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '');
  }
};


module.exports = Utils;