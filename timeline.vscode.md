<markdown-html>
    <head>
        <title>Timeline VSCode</title>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="description" content="Timeline for multi purpose application in VSCode: Requires timeline-vscode extension" />
        <meta name="author" content="Leroy Thompson" />
        <link rel="stylesheet" href="style.css?v=1.0" />
    </head>
    <body>
        <div id="app">
            <div id="info"></div>
            <br><div id="fps"></div>            
        </div>
    </body>
    <script type="text/javascript" src="node_modules/three/build/three.js"></script>
    <script type="text/javascript" src="node_modules/three/examples/js/controls/OrbitControls.js"></script>
    <script type="text/javascript" src="node_modules/stats.js/src/Stats.js"></script>
    <script type="text/javascript" src="lib/vendor/CSPL.js"></script>
    <script type="text/javascript" src="lib/math.addon.js"></script>
    <script type="text/javascript" src="lib/math.addon.type.js"></script>
    <script type="text/javascript" src="lib/window.app.js"></script>
    <script type="text/javascript" src="lib/Streaming.js"></script>
    <script type="text/javascript" src="lib/Streaming.addon.js"></script>
    <script type="text/javascript" src="lib/Streaming.addon.runtime.js"></script>
    <script type="text/javascript" src="lib/Streaming.addon.runtime.binding.js"></script>
    <script type="text/javascript" src="lib/Streaming.addon.runtime.timeframe.js"></script>
    <script type="text/javascript" src="lib/Streaming.addon.runtime.buffer.js"></script>
    <script type="text/javascript" src="lib/Streaming.addon.runtime.buffer.ease.js"></script>
    <script type="text/javascript" >
        context('app', 'fps');
        var canvas = createCanvas('3d');
        var ctx = canvas.context;
        // Get the Streaming class
        var stream = new Streaming(1000); 
        // prepare stream and exploit access to context, addons, data and GUI
        // timeline context with Streaming
        ctx.timeline = stream.access(true, 0, 0, 0, true, 0, -999999, false);
        //parent.vscode.open('app.js')
    </script>
    <!--APP - MAIN-->
    <script type="text/javascript" src="app.js">// THREE scene and stream bindings//</script>
    <script type="text/javascript">
        // setup binding data for Streaming for the canvas
        canvas.app.SetupContextBindsForStream('timeline');
        // build stream and prebuff from the binding data
        ctx.timeline.build();
        // To-Do -  rebuild stream and prebuff from new bindling data eg, Todo - ctx.timeline.rebuild();
        // GRAPHICS
        canvas.app.createGfxs();
    </script>
    <script>
        document.addEventListener("keydown", function (e) {
            if (e.which === 70) {//f
            } else if (e.which === 71) {//g
            }
        });
    </script>
    <script type="text/javascript" src="node_modules/exdat/build/dat.gui.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.window.app.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.buffer.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.timeline.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.timeline.seek.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.timeline.seek.bar.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.timeline.seek.insert.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.timeline.seek.insert.action.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.timeline.seek.insert.sound.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.timeline.seek.insert.comment.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.timeline.seek.insert.segment.js"></script>
    <script type="text/javascript" src="lib/dat.gui.addon.Streaming.timeframe.timeline.charts.js"></script>
</markdown-html>
