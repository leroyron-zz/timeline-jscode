window.Authority = new function (app, timeline) {
    this.commentID = 1000

    this.content =
    `
    `

    this.main = function () {
        app.comment.label.innerHTML = ''
        app.comment.content.innerHTML = this.content
    }
    return this
}(this.app, this.ctx.timeline.addon.timeframe.timeline)
