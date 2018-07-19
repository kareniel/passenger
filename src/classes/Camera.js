var { Vector, Box } = require('@/lib/math')

module.exports = class Camera {
  constructor (position, size) {
    this.SPEED = 256

    this.position = position || new Vector(0, 0)
    this.size = size || new Vector(320, 240)

    this.__velocity = 0
    this.__translation = new Vector()
    this.__nextPosition = new Vector()
    this.__nextMax = new Vector()
    this.__box = new Box()
  }

  move (delta, direction, scene) {
    this.__velocity = this.SPEED * delta
    this.__translation.copy(direction).multiplyScalar(this.__velocity)
    this.__nextPosition.copy(this.position)
    this.__nextPosition.add(this.__translation)
    this.__nextPosition.round()
    this.__nextMax.copy(this.__nextPosition).add(this.size)
    this.__box.set(this.__nextPosition, this.__nextMax)

    if (scene.bounds.containsBox(this.__box)) {
      this.position.copy(this.__nextPosition)
    }
  }

  worldToScreen (vector) {
    return vector.sub(this.min)
  }

  screenToWorld (vector) {
    return vector.add(this.min)
  }
}
