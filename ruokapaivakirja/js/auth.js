var Auth = {
    appName: "sovelluksen nimi",
    appKey: "sovelluksen avain",
    urlRoot: "http://toimiiks.cloudapp.net/api/json",
    passwordSalt: "djn12gsiugaieufe4f8fafh",
    escape: encodeURIComponent
}

Auth.getHeader = function (url, method, data, username, key) {
    url = urlRoot + url;
    method = method.toUpperCase();
    var params = {
        "username": UserService.getUsername(),
        "client": appName,
        "timestamp": new Date().getTime().toString().substr(0, 10)
    }

    // Nämä parametrit eivät tule Authorization-headeriin,
    // niitä käytetään vain allekirjoituksessa:
    var signatureParams = {};
    for (var attr in params) { signatureParams[attr] = params[attr]; };
    for (var attr in data) { signatureParams[attr] = data[attr]; };

    // Kääritään parametrit yhteen merkkijonoon allekirjoitusta varten:
    var keys = Object.keys(signatureParams).sort(),
        paramPairs = [];
    for (var i in keys) {
        paramPairs.push(escape(keys[i]) + "=" + escape(signatureParams[keys[i]]));
    }
    var paramsStr = paramPairs.join("&");

    // Lisätään HTTP-metodi ja URL merkkijonoon:
    var baseStr = [escape(method), escape(url), escape(paramsStr)].join("&");

    // Luodaan allekirjoitus:
    var userKey = HashService.sha1(UserService.getPassword() + passwordSalt),
        signingKey = appKey + "&" + userKey;

    params["signature"] = HashService.hmac(signingKey, baseStr);

    // Luodaan Authorization-header:
    authParams = []
    for (var key in params) {
        authParams.push(escape(key) + '="' + escape(params[key]) + '"');
    }
    var authHeader = authParams.join(",");
}
