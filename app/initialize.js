document.addEventListener('DOMContentLoaded', function() {
  // parse a spec and create a visualization view
  function parse(spec) {
    vg.parse.spec(spec, function(chart) {
      chart({el:"#vis"}).update();
    });
  }
  parse("/spec.json");
});
