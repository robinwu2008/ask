　var str = "18038022797@oooo.com";

console.log((/^1[3|4|5|8][0-9]\d{4,8}$/.test(str)));
//(/^[_/.0-9a-z-]+@([0-9a-z][0-9a-z-]+/.)+[a-z]{2,3}$/).test(str)
console.log((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(str))
