const https = require('https');
const querystring = require('querystring');

exports.handler = (event, context, callback) => {

    var gitpayload = JSON.parse(event.body);
    console.log(gitpayload);
    
    var str = '[info][title] GitHub お知らせ [/title]'; 
    str += gitpayload.sender.login + ' さんが ' + gitpayload.repository.full_name + ' をアップデートしました。\r\n\r\n';
    str += 'EVENT:\r\n';
    str += gitpayload.hook.events; 
    str += '\r\n';
    str += '[hr]';
    str += gitpayload.repository.html_url;
    str += '[/info]';

    var response = {
        statusCode: 200,
        headers: {},
        body: ""
    };

    var headers = {
        'X-ChatWorkToken':'b992840d1499c202618b19ffbca83f2b'
    };
    
    var payload = querystring.stringify({
        'body': str
    });

    var options = {
        method: 'POST',
        hostname: 'api.chatwork.com',
        port: 443,
        path: '/v2/rooms/{roomID}/messages',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ChatWorkToken':'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }
    };

    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log(body);
        });
    });
    
    req.on('error', function(e) {
        context.fail(e.message);
        response.statusCode = 400;
    });
  
    req.write(payload);
    req.end();
    
    callback(null, response);
};





