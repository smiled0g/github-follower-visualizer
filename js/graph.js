/*
 ** A class that handles graph visualization
 */

var Graph = function(canvas_selector) {
    this.canvas_selector = canvas_selector;
    this.initGraph();
}

Graph.prototype.initGraph = function() {
    var self = this;
    this.g = cytoscape({
        container: $(this.canvas_selector)[0],

        boxSelectionEnabled: false,
        autounselectify: true,

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(id)'
            })
            .selector('edge')
            .css({
                'target-arrow-shape': 'triangle',
                'width': 4,
                'line-color': '#ddd',
                'target-arrow-color': '#ddd',
                'curve-style': 'bezier'
            })
            .selector('.highlighted')
            .css({
                'background-color': '#61bffc',
                'line-color': '#61bffc',
                'target-arrow-color': '#61bffc',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            }),
        
        elements: {
            nodes: [], 
            edges: []
        },
        
        layout: {
            name: 'breadthfirst',
            directed: true,
            padding: 10
        }
    });
};

Graph.prototype.update = function(root, elements) {
    this.g.json({ elements: elements });
    this.g.layout({
        name: 'breadthfirst',
        directed: true,
        roots: '#'+root,
        padding: 30
    });
};

window.Graph = Graph;