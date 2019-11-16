const https = require('https');
const querystring = require('querystring');

exports.handler = (event, context, callback) => {

    var branch = '';
    var gitpayload = JSON.parse(event.body);
    console.log(gitpayload);
    
    var str = '[info][title] GitHub お知らせ [/title]'; 
    str += gitpayload.sender.login + ' さんが ' + gitpayload.repository.full_name + ' をアップデートしました。\r\n\r\n';
    
    str += 'Repository: ' + gitpayload.repository.full_name;
    str += '\r\n';   
    if ('ref' in gitpayload) {
        branch = gitpayload.ref.replace('refs/heads/','');
        str += 'Branch: ';
        str += branch; 
        str += '\r\n';   
    }
    if (gitpayload.before == '0000000000000000000000000000000000000000') {
        str += '[hr]';
        str += 'The branch has been created.';
    }
    else if (gitpayload.after == '0000000000000000000000000000000000000000') {
        str += '[hr]';
        str += 'The branch has been deleted.';
    }
    else if ('commits' in gitpayload) {
        str += '[hr]';
        if (gitpayload.commits.length > 0) {
            gitpayload.commits.forEach(function(value ) {
                str += value.message; 
                str += '\r\n';
            });
        }
    }
    str += '[hr]';
    str += gitpayload.repository.html_url;
    if (branch != '') {
        str += '/tree/' + branch;
    }
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
        path: '/v2/rooms/169903053/messages',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ChatWorkToken':'b992840d1499c202618b19ffbca83f2b'
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
