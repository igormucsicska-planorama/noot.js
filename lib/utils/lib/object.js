var Obj = {};


Obj.renameProperty = function(obj, from, to) {
  obj[to] = obj[from];
  delete obj[from];
  return obj;
};


module.exports = Obj;