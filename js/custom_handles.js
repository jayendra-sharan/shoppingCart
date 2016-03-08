Handlebars.registerHelper('uppercase', function(str) {
  return str.toUpperCase();
});

Handlebars.registerHelper('ifCond', function(o1, o2, options) {
  if(o1 < o2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('strikethrough', function(str) {
  return new Handlebars.SafeString ("<p class='discount'>" + str + "</p>");
});

Handlebars.registerHelper('currency', function(str) {
  return new Handlebars.SafeString('<span class="dollar_sign">$</span>'+(('0' + str.toFixed(2)).slice(-5)).toString());});

