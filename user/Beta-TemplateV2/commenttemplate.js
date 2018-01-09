window.Authority = new function (app, timeline) {
    this.commentID = 'template'

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
    box-sizing: border-box;
    '>
    Timeline-JSCode offers intuitive design allowing functionality for code storyboarding, scaling of frameworks and applications.
    </div>
    `

    this.label =
    `
    Template V2 for Beta &nbsp;
    `

    this.style = `
    #comment {position: relative; color: #000; font: 11px "Lucida Grande",sans-serif; left: 105px; top: 102px; width: 75%; z-index: 21;}
    #comment, .CM div {float: left; width: 100%;}
    .CM label {
        padding-bottom: 3px;
        font-size: 14px;
        text-indent: 5px;
        float: left;
        display: block;
        position: relative;
        color: #222;
        border-radius: 1px;
        background: #fffae7;
        top: -1px;
        word-break: break-all;
    }
    .CM #content {overflow: auto; left: 25px; top: -15px;}
    `

    app.comment = {
        _style: document.createElement('style'),
        element: document.createElement('div'),
        label: document.createElement('label'),
        content: document.createElement('div'),
        _resize: function () {
            this.element.style.width = (app.width - 392) + 'px'
            // this.element.style.paddingRight = 20 + 'px'
            this.element.style.maxHeight = (app.height - 155) + 'px'
            this.content.style.maxHeight = (app.height - 140) + 'px'
        }
    }
    app.comment.element.id = 'comment'
    app.comment.element.className = 'CM'

    app.comment.label.innerHTML = this.label
    app.comment.content.innerHTML = this.content
    app.comment.content.id = 'content'

    app.comment.element.appendChild(app.comment.label)
    app.comment.element.appendChild(app.comment.content)

    app.comment._style.innerHTML = this.style
    app.element.appendChild(app.comment._style)
    app.comment.style = app.comment._style.cloneNode(true)
    app.comment.style.innerHTML = ''
    app.element.appendChild(app.comment.style)
    app.element.appendChild(app.comment.element)
    app.comment._resize()
    window.resizeCalls.push(app.comment)

    this.main = function () {
        app.comment.content.innerHTML = this.content
    }
    return this
}(this.app, this.ctx.timeline.addon.timeframe.timeline)
