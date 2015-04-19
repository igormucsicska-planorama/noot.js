var Utils = {

  /**
   * Transform a string to a dash-case compliant one.
   *
   * ```javascript
   * NOOT.dasherize('MyClass'); // my-class
   * NOOT.dasherize('a;weirdString'); // a-weird-string
   * NOOT.dasherize('_private_property'); // private-property
   * ```
   *
   * @method dasherize
   * @for NOOT
   * @static
   * @param {String} str
   * @return {String}
   */
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