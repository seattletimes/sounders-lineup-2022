// var paywall = require("./lib/paywall");
// setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");

var qsa = function(s) { return Array.prototype.slice.call(document.querySelectorAll(s)) };

var images = qsa("div.fixable");
var dest = document.querySelector(".fixed-frame");
var sections = qsa(".parallax-play");

var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

var pictureSize = viewportWidth > 500 ? "desktop" : "mobile";

var dots = document.createElement("ul");
dots.className = "dots";

var indexed = [];

images.forEach(function(img, i) {
  var index = img.getAttribute("data-index");
  var picture_id = img.getAttribute("data-picture");
  indexed[index * 1] = img;

  img.style.backgroundImage = `url('assets/pictures/${pictureSize}/${picture_id}')`;

  // if (!i) img.style.opacity = 0;
  // dest.appendChild(img);
  var dot = document.createElement("li");
  dot.className = "dot";
  dots.appendChild(dot);
});

dest.appendChild(dots);

var debounce = function(f, d) {
  d = d || 100;
  var timeout = null;
  return function() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    if (timeout) return;
    timeout = setTimeout(function() {
      timeout = null;
      f.apply(null, args);
    }, d);
  };
};

window.addEventListener("scroll", debounce(function(e) {
  var activeDot = dots.querySelector(".active");
  if (activeDot) activeDot.className = activeDot.className.replace(/active/g, "");
  var lastVisible = 1;

  for (var i = 1; i < sections.length; i++) {
    var section = sections[i];
    var bounds = section.getBoundingClientRect();
    if (bounds.top <= window.innerHeight) {
      // indexed[i].setAttribute("visible", "");
      indexed[i].style.opacity = 1;
      lastVisible = i + 1;
    } else {
      console.log(indexed[i]);
      // indexed[i].removeAttribute("visible");
      indexed[i].style.opacity = 0;
    }
  }

  dots.querySelector(".dot:nth-child(" + lastVisible + ")").className += " active";
}));

try {
  document.createEvent("TouchEvent");
  document.body.classList.remove("mouse");
  qsa(".description").forEach(function(box) {
    box.addEventListener("click", function(e) {
      box.classList.toggle("flip");
    });
  });
} catch (e) {
  /* no touchscreen */
  qsa(".close").forEach(function(c) {
    c.classList.remove("show");
  });
  qsa(".description").forEach(function(d) {
    d.classList.remove("pointer");
  });
}

// document.querySelector("aside.no-mobile-portrait .ok").addEventListener("click", function() {
//   document.body.className += " hide-warning";
// })
