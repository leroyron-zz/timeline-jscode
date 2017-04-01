var Authority = new function (app) {
    this.soundID = 160

    var audio = new Audio(app.fileLocAssets+'slinkysongloop.mp3');
    
    this.main = function () {
        audio.play();
    }
    return this
}(this.app)
