/*
 ** Main entrance of the app
 */

var App = function(canvas_selector) {
    this.canvas_selector = canvas_selector;
    this.graph = new Graph(this.canvas_selector);
    this.github = new Github();
};

App.prototype.start = function() {
    // Add event listeners
    $('#fetch').click(function() {
        // Disable forms
        $('#fetch').attr('disable', 'true');
        this.buildGraph(function() {
           $('#fetch').removeAttr('disable');
        });
    }.bind(this));
};

App.prototype.graphDataFromProfiles = function(profiles) {
    var ids = Object.keys(profiles);
    var graph_data = {
        nodes: [], 
        edges: []
    };
    // Populate graph_data
    ids.map(function(id) {
        graph_data.nodes.push(
            { data: { id: profiles[id].login } }
        );
        if(profiles[id].followers) {
            profiles[id].followers.map(function(follower) {
                if(profiles[follower]) {
                    graph_data.edges.push(
                        { data: { id: id+'_'+follower, weight: 1, source: id, target: follower } }
                    );
                }
            });
        }
    });
    return graph_data;
}

App.prototype.buildGraph = function(onSuccess) {
    console.log(this.github);
    // Get form values
    var github_id = $('#github_id').val();
    var max_degree = parseInt($('#degree').val());

    // Clear graph

    // Fetch profile, then followers data **in BFS manner**
    var profiles = {}; // Map of id -> profiles with [followers_id]
    var fetchQueue = [];
    var handleFetchResult = function(followee_id, followers) {
        // Add followers' data to profile map
        var rank = profiles[followee_id].__rank+1;
        followers.map(function(follower) {
            if(!profiles[follower.login]) {
                follower.__rank = rank;
                profiles[follower.login] = follower;
                if(rank < max_degree) fetchQueue.push(follower.login);
            } else {
                onSuccess();
            }
        });
        // Add list of followers' id to profile
        profiles[followee_id].followers = followers.map(function(follower){ return follower.login });
        // Update graph
        this.graph.update(this.graphDataFromProfiles(profiles));
        console.log(this.graphDataFromProfiles(profiles));

        // Fetch followers of the next in queue
        if(fetchQueue.length > 0) {
            this.github.fetchFollowers(fetchQueue.shift(), handleFetchResult);
        }
    }.bind(this);
    // Start by fetching the root id's profile
    this.github.fetchProfile(github_id, function(id, profile_data) {
        profile_data.__rank = 0;
        profiles[profile_data.login] = profile_data;
        this.github.fetchFollowers(github_id, handleFetchResult);
    }.bind(this));
};

window.App = App;