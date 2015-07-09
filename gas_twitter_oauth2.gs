TWITTER_CONSUMER_KEY = '<your key>';
TWITTER_CONSUMER_SECRET = '<your secret>';

function doGet(e) {
  // アクセストークンの取得
  var tokenUrl = "https://api.twitter.com/oauth2/token";
  var tokenCredential = Utilities.base64EncodeWebSafe(TWITTER_CONSUMER_KEY + ":" + TWITTER_CONSUMER_SECRET);
  var tokenOptions = {
    headers : {
      Authorization: "Basic " + tokenCredential,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" 
    },
    method: "post",
    payload: "grant_type=client_credentials"
  };
  var responseToken = UrlFetchApp.fetch(tokenUrl, tokenOptions);
  var parsedToken = JSON.parse(responseToken);
  var token = parsedToken.access_token;
  
  
  // Application-only authenticationでTwitter APIの利用
  var apiUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterjp&count=2";
  var apiOptions = {
    headers : {
      Authorization: 'Bearer ' + token
    },
    "method" : "get"
  };
  var responseApi = UrlFetchApp.fetch(apiUrl, apiOptions);
  
  
  // バリデーション
  if (responseApi.getResponseCode() !== 200) return "";
  var tweets = JSON.parse(responseApi.getContentText());
  if (!tweets) return "";
  
  
  // 結果を表示
  var result = "";
  for (var i = 0; i < tweets.length; i++) {
    var tweet = tweets[i].text;
    var date = new Date(tweets[i].created_at);
    result += "[" + date.toUTCString() + "]" + tweet + " / ";
  }
  return ContentService.createTextOutput(result);  
}
