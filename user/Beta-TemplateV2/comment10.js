window.Authority = new function (app, timeline) {
    this.commentID = 10

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
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lacinia placerat sapien a aliquet. Etiam sit amet orci risus. Aenean dignissim finibus urna, ac pellentesque libero eleifend non. In nec felis ut tellus interdum vulputate. In suscipit feugiat facilisis. Pellentesque rutrum bibendum nunc quis sagittis. Maecenas urna elit, efficitur a felis eget, semper pulvinar lectus. Ut semper justo justo, sed consectetur velit volutpat non. In feugiat magna at felis gravida elementum. Mauris maximus luctus eros ut feugiat. Cras ac rhoncus lectus, et faucibus nulla.
    </div>
    `

    this.main = function () {
        // app.comment.style.innerHTML = this.style
        app.comment.label.innerHTML = 'Untitled &nbsp;'
        app.comment.content.innerHTML = this.content
    }
    return this
}(this.app, this.ctx.timeline.addon.timeframe.timeline)
