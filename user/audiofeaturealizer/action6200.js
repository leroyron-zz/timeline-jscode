window.Authority = new function (app, canvas, ctx) {
    this.actionID = 6200

    var timelineLength = ctx.timeline.length
    var imgs = ctx.imgs
    var timeframe = ctx.timeline.addon.timeframe

    timeframe.clearRuntimeAuthoritiesNear('segment', this.actionID, 200)

    timeframe.timeline.removeInsertsNear('segment', this.actionID, 200)

    this.main = function () {
        // used for reference, because it may get skipped over by mp3 syncing
        ctx.timeline.addon.timeframe.process = function () {
            ctx.process(this.access, this.frame._duration, this._timeFrame, this.lapse)// before timeFrame process
        }

        ctx.process = function (access, duration, timeFrame, lapse) {

        }

        ctx.calc = function (lapse, access) {

        }

        ctx.rendering = function (timeFrame) {

        }

        ctx.compute = function () {

        }
    }
    return this
}(this.app, this.canvas, this.ctx, this.ctx.timeline.addon.buffer)
