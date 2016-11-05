/**
 * dat.gui prototypes for 0.6.2
 * @dataarts / dat.GUI / https://github.com/dataarts/dat.gui
 * @author leroyron / http://leroy.ron@gmail.com
 * //customize dat.gui / bind/handle callbacks
 */
(function (dat) {
    dat.GUI.prototype.addHtmlFolder = function (name) {
    // We have to prevent collisions on names in order to have a key
    // by which to remember saved values
        if (this.__folders[name] !== undefined) {
            throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"')
        }

        var newGuiParams = { name: name, parent: this }

    // We need to pass down the autoPlace trait so that we can
    // attach event listeners to open/close folder actions to
    // ensure that a scrollbar appears if the window is too short.
        newGuiParams.autoPlace = this.autoPlace

    // Do we have saved appearance data for this folder?
        if (this.load && // Anything loaded?
    this.load.folders && // Was my parent a dead-end?
    this.load.folders[name]) {
        // Did daddy remember me?
        // Start me closed if I was closed
            newGuiParams.closed = this.load.folders[name].closed

        // Pass down the loaded data
            newGuiParams.load = this.load.folders[name]
        }

        var gui = new this.constructor(newGuiParams)
        this.__folders[name] = gui
        var li = addHtmlRow(this, gui.domElement)

        addHtmlClass(li, 'folder')

        return this
    }

    function addHtmlRow (gui, newDom, liBefore) {
        var li = document.createElement('li')
        if (newDom) {
            newDom.getElementsByClassName('title')[0].innerHTML = newDom.getElementsByClassName('title')[0].innerText
            li.appendChild(newDom)
        }

        if (liBefore) {
            gui.__ul.insertBefore(li, liBefore)
        } else {
            gui.__ul.appendChild(li)
        }
        gui.onResize()
        return li
    }

    function addHtmlClass (elem, className) {
        if (elem.className === undefined) {
            elem.className = className
        } else if (elem.className !== className) {
            var classes = elem.className.split(/ +/)
            if (classes.indexOf(className) === -1) {
                classes.push(className)
                elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '')
            }
        }
    }

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    dat.GUI.prototype.bind = function bind (elem, event, func, newBool) {
        var bool = newBool || false
        elem._this = this
        if (elem.addEventListener) {
            elem.addEventListener(event, func, bool)
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + event, func)
        }
    }
    dat.GUI.prototype.unbind = function unbind (elem, event, func, newBool) {
        var bool = newBool || false
        if (elem.removeEventListener) {
            elem.removeEventListener(event, func, bool)
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + event, func)
        }
    }

    dat.GUI.prototype.open = function open () {
        this.openFolderCallbacks(this.__ul.innerText)
        this.closed = false
    }

    dat.GUI.prototype.close = function close () {
        this.closeFolderCallbacks(this.__ul.innerText)
        this.closed = true
    }

    dat.GUI.prototype.onClickTitle = function onClickTitle (e) {
        e.preventDefault()
        this._this.openFolderCallbacks(this.innerText)
    }

    dat.GUI.prototype.onopenFolder = function (func) {
        this.openFolderCalls[this.__ul.innerText] = func
        this.bind(this.domElement, 'click', this.onClickTitle)
    }

    dat.GUI.prototype.openFolderCalls = {}
    dat.GUI.prototype.openFolderCallbacks = function (ulTitle) {
        if (typeof this.openFolderCalls[ulTitle] != 'undefined') {
            this.openFolderCalls[ulTitle]()
        }
    }

    dat.GUI.prototype.closeFolderCalls = {}
    dat.GUI.prototype.closeFolderCallbacks = function (ulTitle) {
        if (typeof this.closeFolderCalls[ulTitle] != 'undefined') {
            this.closeFolderCalls[ulTitle]()
        }
    }

    this.gui = new dat.GUI({
        load: JSON,
        preset: 'Chrome'
    })

    /**
     * dat.gui AddOn
     * @author leroyron / http://leroy.ron@gmail.com
     * //bind / handle callbacks
     */
    this.gui.addon = {bind: {}}
    this.gui.addon.bind.onchange = function (controller, func) {
        controller.onChange(function (val) {
        // ToDo - !!do val check!!
            func(this)
        })
    }
    this.gui.addon.bind.onupdate = function (controller, update, func) {
        update.updateCalls.push([controller, func])
        update.uclen++
    }
    this.gui.addon.bind.onruntime = function (controller, runtime, func) {
        runtime.runtimeCalls.push([controller, func])
        runtime.rclen++
    }
    this.gui.addon.bind.onpass = function (controller, pass, func) {
        pass.passCalls.push([controller, func])
        pass.pclen++
    }
})(this.dat)
