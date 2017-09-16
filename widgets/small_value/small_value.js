define(function () {
  return {
    update: function(root, data) {
      $(root).find('.title').html(data["title"]);
      $(root).find('.value').html(data["value"]);
    }
  };
});