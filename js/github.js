/*
 ** A utility class that handles fetching data from github via unauthenticated API
 ** Because we're using an unauthenticated API, we'll limit frequency of
 **   our requests to 1 Hz.
 */

var Github = function() {
    this.DELAY = 1000; // Delay between each request
    this.LAST_QUERY = 0; // Timestamp of the last query
}

Github.prototype.getWithEnsureDelay = function(url, onSuccess) {
    var now = new Date().getTime();
    var diff = this.LAST_QUERY+this.DELAY-now;
    console.log('Fetch',diff);
    setTimeout(function() {
        this.LAST_QUERY = new Date().getTime();
        $.get(url, onSuccess);
    }.bind(this), diff < 0 ? 0 : diff);
};

Github.prototype.fetchProfile = function(id, onSuccess) {
    this.getWithEnsureDelay('https://api.github.com/users/'+id, function(data) {
        onSuccess(id, data);
    });
};

Github.prototype.fetchFollowers = function(id, onSuccess) {
    this.getWithEnsureDelay('https://api.github.com/users/'+id+'/followers', function(data) {
        onSuccess(id, data);
    });
};

window.Github = Github;