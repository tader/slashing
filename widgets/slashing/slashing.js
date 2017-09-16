function widget(config, callback) {
  /**
   * Simple object check.
   * @param item
   * @returns {boolean}
   */
  function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  /**
   * Deep merge two objects.
   * @param target
   * @param ...sources
   */
  function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return mergeDeep(target, ...sources);
  }

  var w = {};

  w.id = '_' + Math.round(Math.random() * 0xFFFFFFFFFFFFFFFF).toString(16);

  var type = config.type;

  $.get("widgets/" + type + "/" + type + ".html", function (data) {
    w.ele = $(document.createElement("div"));
    w.ele.attr("id", w.id);
    w.ele.html($(data));

    if (typeof config["theme"] !== "undefined") {
      $(w.ele).addClass(config.theme);
    } else {
      $(w.ele).addClass("theme");
    }

    less.render('#'+ w.id + ' { @import "widgets/' + type + '/' + type + '.less"; }', {}, function(e, result) {
      $(w.ele).append("<style>" + result.css + "</style>");

      requirejs(["../" + type + "/" + type], function(functions) {
        w.functions = functions;
        
        w.destroy = function() {
          if (typeof w.functions["teardown"] === "function") {
            w.functions.teardown($(w.ele));
          }
    
          $(w.ele).remove();
        }
    
        w.update = function(d) {
          if (typeof w.functions["update"] === "function") {
            var dt;
            if (typeof config["data"] === "undefined") {
              dt = d;
            } else {
              dt = mergeDeep(config["data"], d);
            }

            w.functions.update(w.ele, dt);
          }
        };

        if (typeof w.functions["setup"] === "function") {
          w.functions.setup(w.ele);
        }

        w.update({});
        if (typeof config["topic"] !== "undefined") {
          on(config.topic, w);
        }

        if (typeof callback === "function") {
          callback(w);
        }
      });
    });
  });

  return w;
}

var subscriptions = {};
var shadow = {};

function on(topic, object) {
  if (typeof subscriptions[topic] === "undefined") {
    subscriptions[topic] = [];
  }

  if (subscriptions[topic].indexOf(object) < 0) { 
    subscriptions[topic].push(object);
    console.log("subscribed", topic, object);
    if (typeof shadow[topic] !== "undefined") {
      console.log("shadow", topic, shadow[topic], object);      
      object.update(shadow[topic]);
    }
  }
}

function event(topic, data) {
  shadow[topic] = data;

  if (typeof subscriptions[topic] !== "undefined") {
    subscriptions[topic].forEach(function(object){
      console.log("event", topic, data, object);
      object.update(data);
    });
  }
}

function unsubscribe(topic, object) {
  if (typeof subscriptions[topic] !== "undefined") {
    subscriptions[topic] = subscriptions[topic].filter(function(item) {
      return item !== object;
    });

    if (subscriptions[topic].length == 0) {
      delete subscriptions[topic];
      delete shadow[topic];
    }
  }
}



event("dashboard", {
  "grid": {
    "cols": 4,
    "rows": 17,
    "gap": "2.0vh"
  },
  "widgets": [
    {
      "topic": "foo",
      "type": "small_value",
      "theme": "theme2",
      "container": {
        "x": 1,
        "y": 1,
        "w": 1,
        "h": 1
      },
      "data": {
        "title": "Foo",
        "value": "?"
      }
    },
    {
      "topic": "foo",
      "type": "small_value",
      "theme": "theme2",
      "container": {
        "x": 2,
        "y": 1,
        "w": 1,
        "h": 1
      },
      "data": {
        "title": "Foo",
        "value": "?"
      }
    },
    {
      "topic": "foo",
      "type": "small_value",
      "theme": "theme2",
      "container": {
        "x": 3,
        "y": 1,
        "w": 1,
        "h": 1
      },
      "data": {
        "title": "Foo",
        "value": "?"
      }
    },
    {
      "topic": "foo",
      "type": "small_value",
      "theme": "theme2",
      "container": {
        "x": 4,
        "y": 1,
        "w": 1,
        "h": 1
      },
      "data": {
        "title": "Foo",
        "value": "?"
      }
    },
    {
      "topic": "foo",
      "type": "value",
      "theme": "theme1",
      "container": {
        "x": 1,
        "y": 2,
        "w": 1,
        "h": 8
      },
      "data": {
        "title": "Foo",
        "value": "?"
      }
    },
    {
      "topic": "weather",
      "type": "value",
      "theme": "theme2",
      "container": {
        "x": 2,
        "y": 2,
        "w": 2,
        "h": 8
      },
      "data": {
        "title": "Weather",
        "value": "1ºC",
        "comment": "rain"
      }
    },
    {
      "type": "value",
      "theme": "theme3",
      "container": {
        "x": 3,
        "y": 10,
        "w": 1,
        "h": 8
      },
      "data": {
        "title": "Weather",
        "value": "5ºC",
        "comment": "rain"
      }
    },
    {
      "type": "rotate",
      "theme": "theme4",
      "container": {
        "x": 1,
        "y": 10,
        "w": 2,
        "h": 8
      },
      "data": {
        "widgets": [
          {
            "topic": "weather",
            "type": "value",
            "container": {
              "time": 2000
            },
            "data": {
              "title": "AWeather",
              "value": "3ºC",
              "comment": "rain"
            }
          },
          {
            "topic": "weather",
            "type": "value",
            "container": {
              "time": 2000
            },
            "data": {
              "title": "BWeather",
              "value": "6ºC",
              "comment": "cloudy"
            }
          }
        ]
      }
    },
    {
      "type": "value",
      "topic": "weather",    
      "theme": "theme1",
      "container": {
        "x": 4,
        "y": 2,
        "w": 1,
        "h": 16
      },
      "data": {
        "title": "Weather",
        "value": "4ºC",
        "comment": "rain"
      }
    }
  ]
});

setInterval(function() {
  event("weather", {
    value: Math.round(Math.random()*200.0)/10.0,
    comment: "rain"
  })
}, 5000);

setInterval(function() {
  event("foo", {
    value: Math.round(Math.random()*100)
  })
}, 10000);

widget({
  "topic": "dashboard",
  "type": "grid",
  "theme": "black"
}, function(w) {
  $('#root').append(w.ele);
});
