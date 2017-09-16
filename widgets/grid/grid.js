define(function () {
  function destroy_all_the_things(root) {
    if (typeof root["grid_objects"] !== "undefined") {
      root.grid_objects.forEach(function(object) {
        object.destroy();
      });
    }

    root.grid_objects = [];
  }

  return {
    setup: function(root) {
      root.grid_objects = [];
    },
    update: function(root, data) {
      if (typeof data === "undefined") return;
      if (typeof data["widgets"] === "undefined") return;

      destroy_all_the_things(root);

      if (typeof data["grid"] !== "undefined") {
        $(root).css("grid-template-columns", "repeat(" + data.grid.cols + ", 1fr)");
        $(root).css("grid-template-rows", "repeat(" + data.grid.rows + ", 1fr)");
        $(root).css("grid-column-gap", data.grid.gap.toString());
        $(root).css("grid-row-gap", data.grid.gap.toString());
      }
      
      data.widgets.forEach(function(element) {
        widget(element, function(w) {
          root.grid_objects.push(w);
          $(w.ele).css("grid-column-start", element.container.x.toString());
          $(w.ele).css("grid-row-start", element.container.y.toString());
          $(w.ele).css("grid-column-end", "span " + element.container.w.toString());
          $(w.ele).css("grid-row-end", "span " + element.container.h.toString());
          $(root).append(w.ele);
        });
      });
    },
    teardown: function(root) {
      destroy_all_the_things(root);
    }
  };
});