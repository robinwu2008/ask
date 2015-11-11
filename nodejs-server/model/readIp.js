var lbs = require('node-qqwry');
exports.getAddr = function(key, cb) {

cb({id:key,address:lbs.getAddress(key),area :lbs.getArea(key),bounds:lbs.getBounds(key)})
}



