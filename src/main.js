import "./style.css"
import { getScrollPos, getClonesHeight } from './util'

import { EmojiAnimator } from './emoji-animation'

const animationContainer = document.getElementById("animate");
const emojiAnimator = new EmojiAnimator(animationContainer, 15, Math.random)
emojiAnimator.animate()

var doc = window.document,
  context = doc.querySelector(".js-loop"),
  clones = context.querySelectorAll(".is-clone"),
  disableScroll = false,
  scrollHeight = 0,
  scrollPos = 0,
  clonesHeight = 0;

function setScrollPos(pos) {
  context.scrollTop = pos;
}


function reCalc() {
  scrollPos = getScrollPos(context);
  scrollHeight = context.scrollHeight;
  clonesHeight = getClonesHeight(clones);

  if (scrollPos <= 0) {
    setScrollPos(1); // Scroll 1 pixel to allow upwards scrolling
  }
}

function scrollUpdate() {
  if (!disableScroll) {
    scrollPos = getScrollPos(context);

    if (clonesHeight + scrollPos >= scrollHeight) {
      // Scroll to the top when you’ve reached the bottom
      setScrollPos(1); // Scroll down 1 pixel to allow upwards scrolling
      disableScroll = true;
    } else if (scrollPos <= 0) {
      // Scroll to the bottom when you reach the top
      setScrollPos(scrollHeight - clonesHeight);
      disableScroll = true;
    }
  } else {
    // Disable scroll-jumping for a short time to avoid flickering
    window.setTimeout(function() {
      disableScroll = false;
    }, 40);
  }
}

function init() {
  reCalc();

  context.addEventListener(
    "scroll",
    function() {
      window.requestAnimationFrame(scrollUpdate);
    },
    false
  );

  window.addEventListener(
    "resize",
    function() {
      window.requestAnimationFrame(reCalc);
    },
    false
  );
}

if (document.readyState !== "loading") {
  init();
} else {
  doc.addEventListener("DOMContentLoaded", init, false);
}

// Just for this demo: Center the middle block on page load
window.onload = function() {
  setScrollPos(
    Math.round(
      clones[0].getBoundingClientRect().top +
      getScrollPos(context) -
      (context.offsetHeight - clones[0].offsetHeight) / 2
    )
  );
};

