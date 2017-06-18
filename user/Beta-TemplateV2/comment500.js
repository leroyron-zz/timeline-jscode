window.Authority = new function (app, timeline) {
    this.commentID = 500

    this.main = function () {
        // app.comment.style.innerHTML = this.style
        app.comment.label.innerHTML = ''
        // app.comment.content.innerHTML = this.content
    }
    return this
}(this.app, this.ctx.timeline.addon.timeframe.timeline)
