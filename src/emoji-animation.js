const emoji = [
  "💖",
  "⚡",
  "🔊",
  "🥳",
  "🎧",
  "💥",
  "🎉",
  "🔥",
  "🎛️",
  "🎚️",
  "🎷",
  "🎹",
  "🎺",
  "🎻",
  "🎨",
  "⭐",
  "👑",
  "📸",
  "🎸",
  "🎟️",
  "🎫",
  "🎥",
  "🎓",
  "✨",
  "👍",
  "😁",
  "😎",
  "🏆",
  "👏",
  "💃",
  "🎊",
  "😍",
  "🍾",
  "🥂",
  "🕺",
  "✌",
  "🤟",
  "🙌",
  "🥇",
  "🎖️",
  "💯"
];

const emojiRenderXRanges = [0, 222, 444, 777].flatMap(offset => [
    [11 + offset, 333],
    [11 - offset, -333],
])

export class EmojiAnimator {
  constructor(container, iterations, randomGenerator) {
    this.container = container
    this.circles = [];
    this.randomGenerator = randomGenerator
    for (let i = 0; i < iterations; i++) {
      let  index = 0;
      for(const range of emojiRenderXRanges) {
        this.addEmoji(
          i * index++ * 111,
          range,
          emoji[Math.floor(randomGenerator() * emoji.length)]
        );
      }
    }
  }

  addEmoji(delay, range, emoji) {
    setTimeout(() => {
      const c = Emoji.new(
        this.container,
        range,
        emoji,
        Emoji.randomVelocity(this.randomGenerator),
        this.randomGenerator,
      );
      this.circles.push(c);
    }, delay);
  }

  update(action){
    for (let circle of this.circles) {
      circle.update();
      action && action(circle)
    }
  }

  animate() {
    this.update((circle) => circle.render())
    requestAnimationFrame(() => this.animate());
  }
}


export class Emoji {
  constructor(container, x, y, c, v, range, randomGenerator) {
    this.x = x;
    this.y = y;
    this.color = c;
    this.v = v;
    this.range = range;
    this.container = container
    this.randomGenerator = randomGenerator
    if(container) {
      this.element = document.createElement("span");
      /*this.element.style.display = 'block';*/
      this.element.style.opacity = 0;
      this.element.style.position = "absolute";
      this.element.style.fontSize = "22px";
      this.element.style.color = "hsl(" + ((this.randomGenerator() * 360) | 0) + ",88%,55%)";
      this.element.innerHTML = c;
      container.appendChild(this.element);
    }
  }

  static randomVelocity(randomGenerator){
    return {
      x: -0.15 + randomGenerator() * 0.3,
      y: 1 + randomGenerator() * 1
    }
  }

  static new(container, range, emoji, velocity, randomGenerator) {
    return new Emoji(
      container,
      range[0] + randomGenerator() * range[1],
      88 + randomGenerator() * 4,
      emoji,
      velocity,
      range,
      randomGenerator,
    );
  }

  position(){
    return {
      x: this.x,
      y: this.y,
    }
  }

  update() {
    if (this.y > 888) {
      this.y = 88 + this.randomGenerator() * 4;
      this.x = this.range[0] + this.randomGenerator() * this.range[1];
    }
    this.y += this.v.y;
    this.x += this.v.x;
  }

  render() {
    this.element.style.opacity = 1;
    this.element.style.transform =
      "translate3d(" + this.x + "px, " + this.y + "px, 0px)";
    this.element.style.webkitTransform =
      "translate3d(" + this.x + "px, " + this.y + "px, 0px)";
    this.element.style.mozTransform =
      "translate3d(" + this.x + "px, " + this.y + "px, 0px)";
  }
}

