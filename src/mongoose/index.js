/***********************************************************************************************************************
 * Provides additional functionality to the well know
 * <a href="http://mongoosejs.com/" target="_blank">Mongoose</a> ODM.
 *
 * @class Mongoose
 * @static
 * @namespace NOOT
 **********************************************************************************************************************/
module.exports = {
  Schema: require('./lib/schema'),
  useTimestamps: require('./lib/middlewares/use-timestamps')
};