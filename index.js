var express = require('express');
var app = express();
var fs = require('fs');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/files'));
app.use(function(req, res, next) {
  var data='';
  req.setEncoding('utf8');
  req.on('data', function(chunk) { 
    data += chunk;
  });
 
  req.on('end', function() {
    req.body = data;
    next();
  });
});


app.all('/api/:file', function(request, response) {
  var output = 'Headers:\n' + JSON.stringify(request.headers);
  output += '\n\nBody:\n' + request.body;

  fs.writeFile('files/' + request.params.file, output, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('Request saved');
  });
  console.log(output);
  response.status(200).send('Success');
});

app.get('/file/:file', function(request, response) {
  response.download(__dirname + '/files/' + request.params.file);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
