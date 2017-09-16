define(function () {
  function rotate(root) {
    if (typeof root === "undefined") {
      return;
    }
    
    if (typeof root["data"] === "undefined") {
      return;
    }
    
    if (typeof root["data"]["widgets"] === "undefined") {
      return;
    }
    
    root.rotate_index++;
    if (root.rotate_index >= root.data.widgets.length) {
      root.rotate_index = 0;
    }
    var item = root.data.widgets[root.rotate_index];
    if (typeof item === "undefined") {
      return;
    }
    
    var previous = root.current;

    widget(item, function(w) {
      $(w.ele).css("grid-column-start", "1");
      $(w.ele).css("grid-row-start", "1");

      if (typeof previous === "undefined") {
        $(root).append(w.ele);
      } else {
        $(previous.ele).replaceWith(w.ele);
        previous.destroy();
      }
      root.current = w;      

      root.timeout = setTimeout(function() { rotate(root); }, item.container.time);
    });
  }

  function start(root) {
    rotate(root);
  }

  function stop(root) {
    if (typeof root["timeout"] !== "undefined") {
      clearTimeout(root.timeout);
    }
  }

  return {
    setup: function(root) {
    },
    update: function(root, data) {
      root.rotate_index = -1;      
      root.data = data;
      start(root);
    },
    teardown: function(root) {
      stop(root);
    }
  };
});