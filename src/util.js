export function getScrollPos(context) {
  return (context.pageYOffset || context.scrollTop || 0) - (context.clientTop || 0);
}

export function getClonesHeight(clones) {
  let clonesHeight = 0;

  for (let i = 0; i < clones.length; i += 1) {
    clonesHeight = clonesHeight + clones[i].offsetHeight;
  }

  return clonesHeight;
}
