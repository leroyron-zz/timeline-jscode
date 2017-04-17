var Authority = new function (app, timeline, buffer, binding, canvas) {
    this.actionID = 730
    var dosentMatter = this.actionID

    var stage = 1
    var generate = 10

    var dropImage = function (sprite, x, y) {
        this.img = new Image()
        this.x = x
        this.y = y
        this.wSrc = 89
        this.hSrc = 88
        this.sprite = sprite
        this.alpha = 1
        this.ate = false
        this.drop =
        sprite == 0 ? 1
        : sprite == 1 ? 0.95
        : sprite == 2 ? 0.9
        : sprite == 3 ? 0.9
        : sprite == 4 ? 0.85
        : sprite == 5 ? 0.6
        : sprite == 6 ? 1
        : sprite == 7 ? 0.5
        : sprite == 8 ? 0.4
        : sprite == 9 ? 0.3
        : 0.7
        this.img.onload = function () {
        }
        this.img.src = app.fileLocAssets + 'items.png'
    }

    canvas.app.drop.items = []
    this.main = function () {
        if (stage == 1) {
            buffer.valIn('timeline', [canvas.app.drop], ['value'], 1, 350, 1044, 1, dosentMatter,
            function () {
                canvas.app.drop.next = this.next = this.next || 0
                canvas.app.drop.items[this.next] = new dropImage(Math.randomFromTo(0, 11), Math.randomFromTo(0, 680 - 50), -88)
                this.next++
            }, false, false, 1)
        }

        if (stage < 10) {
            let gen = generate * stage

            for (let gi = 0; gi < gen / 2; gi++) { // Half and half of time line generate leap values with break/space inbetween
                let randNum = Math.randomFromTo(360, (360 + (86.25 * 2)))
                buffer.valIn('timeline', [canvas.app.drop], ['value'], timeline.arguments.leap, randNum, randNum + 1, 1)
                randNum = Math.randomFromTo((360 + (86.25 * 5)), (360 + (86.25 * 7)) - 20)
                buffer.valIn('timeline', [canvas.app.drop], ['value'], timeline.arguments.leap, randNum, randNum + 1, 1)
            }
            stage++
        }
    }
    return this
}(this.app, this.ctx.timeline, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.canvas)
