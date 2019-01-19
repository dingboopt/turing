var querystring = require("querystring")
var http = require("http")
var post_data = querystring.stringify({
	  key: '5c16ad9cfcf54c24a7d04527041b79d5',
	  info: ' 你是男的？'
});
var options = {
	  host: 'www.tuling123.com',
	  port: 80,
	  path: '/openapi/api',
	  method: 'POST',
	  rejectUnauthorized: false,
	  headers: {
		      "Content-Type": 'application/x-www-form-urlencoded', //这个一定要有
		    }
};
var req = http.request(options, function (res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		      console.log('BODY: ' + chunk);
		    });
});
req.write(post_data);
req.end();

