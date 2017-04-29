window.Authority = new function (app) {
    this.soundID = 360

    var audio = new Audio(app.fileLocAssets + 'slinkysongloop.mp3')

    this.main = function () {
        // audio.play();
    }
    return this
}(this.app)
