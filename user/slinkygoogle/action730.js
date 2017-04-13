var Authority = new function (app, timeline, buffer, binding, canvas) {
    this.actionID = 730
    var dosentMatter = this.actionID

    var stage = 1
    
    var dropImage = function (sprite, x, y) {
        this.img = new Image();
        this.x = x
        this.y = y
        this.wSrc = 89
        this.hSrc = 88
        this.sprite = sprite
        this.alpha = 1
        this.ate = false
        this.img.onload = function() {
            //ctx.drawImage(img, (img.wSrc * img.sprite), img.yPos, img.wSrc, img.hSrc, img.xPos, img.yPos, img.wSrc, img.hSrc)
        }
        this.img.src = app.fileLocAssets + 'items.png';
        //return this.img
    }

    canvas.app.drop.items = Array(120)
    this.main = function () {
        if (stage == 1) {
            buffer.valIn('timeline', [canvas.app.drop], ['value'], 1, 350, 1044, 1, dosentMatter,
            function () {
                canvas.app.drop.next = this.next = this.next || 0
                canvas.app.drop.items[this.next] = new dropImage(Math.randomFromTo(0, 11), Math.randomFromTo(100, canvas.node.width-100), -88)
                this.next++
            }, false, false, 1)
            //buffer.assignLeap('timeline', canvas.app.drop, ['value'], dosentMatter
            //function () {
                
            //}, false, false)
        }

        if (stage < 6) {
            let gen = 5 * stage

            for (let gi=0; gi<gen/2; gi++) { // Half and half of time line generate leap values with break/space inbetween
                let randNum = Math.randomFromTo(360, (360 +(86.25 * 2)))
                buffer.valIn('timeline', [canvas.app.drop], ['value'], timeline.arguments.leap, randNum, randNum + 1, 1)
                randNum = Math.randomFromTo((360 +(86.25 * 5)), (360 +(86.25 * 7))-20)
                buffer.valIn('timeline', [canvas.app.drop], ['value'], timeline.arguments.leap, randNum, randNum + 1, 1)
            }
            stage++
        }
    }
    return this
}(this.app,  this.ctx.timeline, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.canvas)
