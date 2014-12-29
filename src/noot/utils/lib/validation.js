var ValidationUtils = {


  required: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.shift();
    return args.forEach(function(name) {
      if (!obj[name]) throw new Error('`' + name + '` is mandatory');
    });
  }
};

/**
 * @exports
 */
module.exports = ValidationUtils;