/*
dat.gui AddOn

@author leroyron / http://leroy.ron@gmail.com
//handels callbacks
*/
dat.GUI.prototype.addHtmlFolder = function(name) {
    // We have to prevent collisions on names in order to have a key
    // by which to remember saved values
    if (this.__folders[name] !== undefined) {
        throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }

    var newGuiParams = { name: name, parent: this };

    // We need to pass down the autoPlace trait so that we can
    // attach event listeners to open/close folder actions to
    // ensure that a scrollbar appears if the window is too short.
    newGuiParams.autoPlace = this.autoPlace;

    // Do we have saved appearance data for this folder?
    if (this.load && // Anything loaded?
    this.load.folders && // Was my parent a dead-end?
    this.load.folders[name]) {
        // Did daddy remember me?
        // Start me closed if I was closed
        newGuiParams.closed = this.load.folders[name].closed;

        // Pass down the loaded data
        newGuiParams.load = this.load.folders[name];
    }

    var gui = new this.__proto__.constructor(newGuiParams);
    this.__folders[name] = gui;
    var li = addHtmlRow(this, gui.domElement);
    
    addHtmlClass(li, 'folder');

    
    return this;
}

function addHtmlRow(gui, newDom, liBefore) {
    var li = document.createElement('li');
    if (newDom) {
        newDom.getElementsByClassName('title')[0].innerHTML = newDom.getElementsByClassName('title')[0].innerText;
        li.appendChild(newDom);
    }

    if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
    } else {
    gui.__ul.appendChild(li);
    }
    gui.onResize();
    return li;
}

function addHtmlClass(elem, className) {
    if (elem.className === undefined) {
        elem.className = className;
    } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);
        if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
    }
}


dat.GUI.prototype.bind = function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    elem._this = this;
    if (elem.addEventListener) {
        elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + event, func);
    }
}

/**
 *
 * @param elem
 * @param event
 * @param func
 * @param bool
 */
dat.GUI.prototype.unbind = function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
        elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
        elem.detachEvent('on' + event, func);
    }
}

dat.GUI.prototype.open = function open() {
    this.openFolderCallbacks(this.__ul.innerText);
    this.closed = false;
}

dat.GUI.prototype.onClickTitle = function onClickTitle(e) {
    e.preventDefault();
    this._this.closed = this._this.closed;
    this._this.openFolderCallbacks(this.innerText);
};

dat.GUI.prototype.onopenFolder = function (func) {
    this.openFolderCalls[this.__ul.innerText] = func;
    this.bind(this.domElement, 'click', this.onClickTitle);
}

dat.GUI.prototype.openFolderCalls = {};
dat.GUI.prototype.openFolderCallbacks = function (__ul_title) {
    if (typeof this.openFolderCalls[__ul_title] != 'undefined')
        this.openFolderCalls[__ul_title]();
}


var gui = new dat.GUI({
    load: JSON,
    preset: 'Chrome'
});

gui.addon = {};

gui.addon.onchange = function (controller, func) {
    controller.onChange(function (val) {
        //ToDo - !!do val check!!
        func(this);
    });
}

gui.addon.onupdate = function (controller, update, func) {
    update.updateCalls.push([controller, func]);
    update.uclen++;
}

gui.addon.onruntime = function (controller, runtime, func) {
    runtime.runtimeCalls.push([controller, func]);
    runtime.rclen++;
}

gui.addon.onpass = function (controller, pass, func) {
    pass.passCalls.push([controller, func]);
    pass.pclen++;
}