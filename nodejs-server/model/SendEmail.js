var nodemailer = require("nodemailer");
///////////////////////////////////////////////
// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport("SMTP",{
  host: "smtp.163.com", // 主机
  secureConnection: true, // 使用 SSL
  port: 465, // SMTP 端口
  auth: {
    user: "zuaa-q@163.com", // 账号
    pass: "seedcat" // 密码
  }
});
///////////////////////////////////////////////////
 

exports.sendToWiz = function(subject,html) { 
	var mailOptions = {
	  from: "zuaa <zuaa-q@163.com>", // 发件地址
	  to: "zu-q_70@mywiz.cn", // 收件列表
	  subject: subject, // 标题
	  html: html
	} 
	// 发送邮件
	smtpTransport.sendMail(mailOptions, function(error, response){
	  if(error){
	    console.log(error);
	  }else{
	    console.log("Message sent: " + response.message);
	  }
	  smtpTransport.close(); // 如果没用，关闭连接池
	});

} 