var request = require("request")
function getSite(url,time) {
  var url = url
  return new Promise(function (resolve,reject){
  request(url, function (error, response, body) {
      if (error)
        return reject(error)
      else
      return resolve(url + "\n" +  body + "\n" + "--------------------------------------------------------------------------" + "\r")
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

var runTest = executeTest(["http://apple.com", "http://cnn.com", "http://fox.com", "http://google.com", "http://wsj.com","http://bloomberg.com"]);
var done = false
var result = runTest.next()
runState(result,runTest)
