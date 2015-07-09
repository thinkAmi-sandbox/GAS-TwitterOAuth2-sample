TWITTER_CONSUMER_KEY = '<your key>'
TWITTER_CONSUMER_SECRET = '<your secret>'

function doGet(e) {
  
  var tokenCredential = Utilities.base64EncodeWebSafe(TWITTER_CONSUMER_KEY + ":" + TWITTER_CONSUMER_SECRET);
  var options = {
    headers : {
      Authorization: "Basic " + tokenCredential,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" 
    },
    method: "post",
    payload: "grant_type=client_credentials"
  };
  
  
  var responseToken = UrlFetchApp.fetch("https://api.twitter.com/oauth2/token", options);
  var jsonResponseToken = JSON.parse(responseToken);
  var token = jsonResponseToken.access_token;
  
  
  var request = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterjp&count=2";
  var options = {
    headers : {
      Authorization: 'Bearer ' + token
    },
    "method" : "get"
  };
  var response = UrlFetchApp.fetch(request, options);
  
  var result = "";
  if (response.getResponseCode() === 200) {
    var tweets = JSON.parse(response.getContentText());
    
    if (tweets){
      
      var len = tweets.length;
      
      for (var i = 0; i < len; i++) {
        var tweet = tweets[i].text;
        var date = new Date(tweets[i].created_at);
        
        result += "[" + date.toUTCString() + "]" + tweet + "--|--";
      }
    }
  }

  return ContentService.createTextOutput(result);
}
