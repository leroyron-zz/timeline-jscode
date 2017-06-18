window.Authority = new function (app, timeline) {
    this.commentID = 0

    this.content =
    `
    <div style='font-size: 14px;
    background: #fffbee;
    width: 100%;
    padding: 10px 22px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;'>
    Here are the controls gui showing settings and data. &nbsp;
    </div>
    `

    this.main = function () {
        // app.comment.style.innerHTML = this.style
        app.comment.label.innerHTML = 'dat.GUI for settings, timeline and streaming <a href="https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage">gui.data</a>'
        app.comment.content.innerHTML = this.content
        var closeButton = document.getElementsByClassName('close-button')[0]
        if (closeButton.innerHTML == 'Open Controls') closeButton.click()
    }
    return this
}(this.app, this.ctx.timeline.addon.timeframe.timeline)
