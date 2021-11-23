(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dob) {
    this.renderAgeLoop();
  } else {
    this.renderChoose();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var value;

  if (value = localStorage.dob)
    this.dob = new Date(parseInt(value));
};

App.fn.save = function(){
  if (this.dob)
    localStorage.dob = this.dob.getTime();
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  this.dob = input.valueAsDate;
  this.save();
  this.renderAgeLoop();
};

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
};

App.fn.renderAgeLoop = function(){
  (this.renderAge.bind(this))();
  this.interval = setInterval(this.renderAge.bind(this), 60000);  // Update every 1 minute
};

App.fn.renderAge = function(){
  var now       = new Date
  var duration  = now - this.dob;
  var years     = duration / 31556900000;

  // Age
  var majorMinor = years.toFixed(2).toString().split('.');

  // Month day
  var day = now.getDate();
  var month = monthNamesShort[now.getMonth()].toUpperCase();

  // Days until end of year
  var oneDay = 1000*60*60*24;
  var nextYear = new Date((now.getFullYear() + 1), 0, 1);
  var nextYearDaysLeft = Math.ceil( (nextYear.getTime() - now.getTime()) / (oneDay) );

  // Life expectancy
  var lifeExpectancy = 82.3; // google.com/search?q=life+expectancy+canada
  var monthsExpectancy = ((lifeExpectancy - years) * 12).toFixed(2).toString().split('.');


  requestAnimationFrame(function(){
    this.html(this.view('age')({
      year:         majorMinor[0],
      milliseconds: majorMinor[1],

      day: day,
      month: month,

      nextYearDaysLeft: nextYearDaysLeft,

      monthsExpectancy: monthsExpectancy[0],
      monthsMillisExpectancy: monthsExpectancy[1],
    }));
  }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('app'))

})();
