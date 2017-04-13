/**
 * //windowApp: Visual Studio Code linkage for timeline.vscode.md
 * //VScode Command Palette iFrame window parent associating
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (window) {
    window.app.vscode = window.parent.authority || window.top.authority || {_fileLocal: ''}
})(window)