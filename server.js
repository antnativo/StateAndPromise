var request = require("request")
function getSite(url,time) {
  var url = url
  return new Promise(function (resolve,reject){
  request("http://" + url, function (error, response, body) {
      if (error)
        return reject(error)
      else
      return resolve("http://" + url + "\n" +  body + "\n" + "--------------------------------------------------------------------------" + "\r")
   })
  })
}

function *executeTest(urls) { 
  var counter = 0;
  do { 
    yield getSite(urls[counter],(counter * 6000))
    counter++
  }while(counter < urls.length)
}

function runState(contract,generator) { 
  if (!contract.done) { 
    var that = this;  
    contract.value.then(function (data) {
      console.log(data)
      var result = generator.next()
      runState(result, generator)
    })
  }
}
if (process.argv.length && process.argv[2] == "demo") {
  var runTest = executeTest(['apple.com','cnn.com']),
    done = false,
    result = runTest.next();
  runState(result, runTest)
} else { 
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  var util = require('util');
  process.stdin.on('data', function (text) {
    if (text === 'quit\n') {
      process.exit();
    } else {
      console.log(util.inspect(text))
      var urls = text.split(",")
      if (urls.length) {
        var runTest = executeTest(urls),
          done = false,
          result = runTest.next();
        runState(result, runTest)
      }
    }
  });
}