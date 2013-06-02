/* Palvelut */

angular.module("app.services", [])

/* SHA1 ja HMAC-SHA1-funktiot. */
.factory("HashService", function () {
    var replacements = "aooAOO";

    function replaceUmlauts(base) {
        return base.replace(/[äöåÄÖÅ]/g, function (char) {
            return replacements.charAt("äöåÄÖÅ".indexOf(char));
        });
    }

    return {
        sha1: function (base) {
            base = replaceUmlauts(base);
            return CryptoJS.SHA1(base).toString(CryptoJS.enc.Hex);
        },

        hmac: function (key, base) {
            base = replaceUmlauts(base);
            return btoa(CryptoJS.HmacSHA1(base, key).toString(CryptoJS.enc.Hex));
        }
    }
})

/* Ylläpitää käyttäjän kirjautumistietoja. */
.factory("UserService", function () {
    var localSettings = Windows.Storage.ApplicationData.current.localSettings,
        username = localSettings.values["username"],
        password = localSettings.values["password"];

    return {
        getUsername: function () { return username; },
        getPassword: function () { return password; },
        setUserInfo: function (inputUsername, inputPassword) {
            username = inputUsername;
            password = inputPassword;
            localSettings.values["username"] = username;
            localSettings.values["password"] = password;
        },
        updateUserInfo: function () {
            username = localSettings.values["username"];
            password = localSettings.values["password"]
        },
        logout: function () {
            username = null;
            password = null;
            localSettings.values.remove("username");
            localSettings.values.remove("password");
        }
    }
})

/* Autentikoidut HTTP-pyynnöt. */
.factory("Data", ["UserService", "HashService", "$q", "$http", "$log", "$rootScope", function (UserService, HashService, $q, $http, $log, $rootScope) {
    var passwordSalt = "djn12gsiugaieufe4f8fafh",
        appName = "sovelluksen nimi",
        appKey = "sovelluksen avain",
        urlRoot = "http://toimiiks.cloudapp.net/api/json",
        escape = encodeURIComponent;

    function fetch(url, method, data, callback) {
        // Kerätään parametrit allekirjoitusta varten:
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

        // Luodaan HTTP-pyyntö, palautetaan asynkroninen "lupaus":
        var options = {
            method: method,
            url: url,
            headers: { "Authorization": authHeader }
        };

        //var deferred = $q.defer();

        var promise = $http(options).success(function (data, status) {
            callback(data);
        });

        //var promise = $http(options).then(function (result) {
        //    console.log("servicessä: " + JSON.stringify(result));
        //    return result;
        //});

        return promise;

        //return deferred.promise;
    }

    function searchFoods(query) {
        return $http.get("http://toimiiks.cloudapp.net/api/json/foods?q=" + query);
    }

    return {
        fetch: fetch,
        searchFoods: searchFoods
    }
}]);