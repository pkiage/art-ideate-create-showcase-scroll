import { getClonesHeight, getScrollPos } from '../src/util'
import { EmojiAnimator, Emoji } from '../src/emoji-animation'
import * as fc from 'fast-check'

describe('Get current scroll position', () => {
  const input = (bottom, top) => ({
    pageYOffset: bottom,
    clientTop: top
  })
  it('gets the current position of a page', () => {
    fc.assert(
      fc.property(fc.nat(), fc.nat(), (bottom, top) => {
        expect(getScrollPos(input(bottom, top))).toBe(bottom - top)
      })
    )
  })
})

describe('Get clones height', () => {
  it('zero clones', () => {
    expect(getClonesHeight([])).toBe(0)
  })
  it('single clones', () => {
    fc.assert(fc.property(fc.array(fc.nat()), (heights) => {
      for (const height of heights) {
        expect(getClonesHeight([{ offsetHeight: height }])).toBe(height)
      }
    }))
  })
  it('multiple clones', () => {
    fc.assert(fc.property(fc.array(fc.nat()), (heights) => {
      const clones = heights.map(h => ({ offsetHeight: h }))
      const totalHeight = heights.reduce((a, b) => a + b, 0)
      expect(getClonesHeight(clones)).toBe(totalHeight)
    }))
  })
})

describe('Emoji generation', () => {
  it('generate multiple circles with varying random generation functions', () => {
    fc.assert(fc.property(
      fc.float({ min: 0, max: 1 }),
      fc.float({ min: -0.15, max: 0.15 }),
      fc.float({ min: 1, max: 2 }),
      fc.nat({ min: 10, max: 900 }),
      fc.nat({ min: 10, max: 900 }),
      (random, velocityX, velocityY, x1, x2) => {
        const velocity = {
          x: velocityX,
          y: velocityY,
        }
        const randomGenerator = () => random
        const emoji = Emoji.new(null, [x1, x2], "", velocity, randomGenerator)
        for (let i = 0; i < 100; i++) {
          const originalPos = emoji.position()
          emoji.update()
          const currentPos = emoji.position()
          if (originalPos.y > 800) {
            expect(currentPos).toEqual({
              y: 80 + random * 4,
              x: this.range[0] + random * this.range[1],
            })
          } else {
            expect(currentPos).toEqual({
              x: originalPos.x + velocityX,
              y: originalPos.y + velocityY,
            })
          }
        }
      }
    ))
  })
})
