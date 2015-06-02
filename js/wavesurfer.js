'use strict';

var wavesurfers = [];
var wavesurferInfo = [ { 'name': 'piano', 'color': 'violet', 'tag': '#pianoWaveform', 'file': 'audio/piano.mp3'},
                        { 'name': 'brain', 'color': 'green', 'tag': '#brainWaveform', 'file': 'audio/brain.mp3'}]

// Create an instance
for (var i = 0; i < 2 * wavesurferInfo.length; i++) {
    var wavesurfer = Object.create(WaveSurfer);
    wavesurfers.push(wavesurfer);
}

// Init & load audio file
document.addEventListener('DOMContentLoaded', function () {
    for (var i = 0; i < wavesurferInfo.length; i++) {
        var options = {
            container     : document.querySelector(wavesurferInfo[i]['tag']),
            waveColor     : wavesurferInfo[i]['color'],
            progressColor : 'purple',
            loaderColor   : 'purple',
            cursorColor   : 'navy',
            hideScrollbar : true
        };

        // Init
        wavesurfers[i].init(options);
        // Load audio from URL
        wavesurfers[i].load(wavesurferInfo[i]['file']);
    }

    for (; i < 2 * wavesurferInfo.length; i++) {
        var options = {
            container     : document.querySelector('#bothWaveform'),
            waveColor     : wavesurferInfo[i % wavesurferInfo.length]['color'],
            progressColor : 'purple',
            loaderColor   : 'purple',
            cursorColor   : 'navy',
            dragSelection : false,
            hideScrollbar: true
        };

        // Init
        wavesurfers[i].init(options);
        // Load audio from URL
        wavesurfers[i].load(wavesurferInfo[i % wavesurferInfo.length]['file']);
    }

});

// Hack - progress bar shows only progress of last wavesurfer being loaded
document.addEventListener('DOMContentLoaded', function () {
    var progressDiv = document.querySelector('#both-progress-bar');
    var progressBar = progressDiv.querySelector('.progress-bar');

    var showProgress = function (percent) {
        progressDiv.style.display = 'block';
        progressBar.style.width = percent + '%';
        console.log("showing progress");
    };

    var hideProgress = function () {
        progressDiv.style.display = 'none';
        console.log("hiding progress");

        document.getElementById('bothWaveform').childNodes[1].style.width='940px';
    };

    var lastIndex = 2 * wavesurferInfo.length - 1;
    wavesurfers[lastIndex].on('loading', showProgress);
    wavesurfers[lastIndex].on('ready', hideProgress);
    wavesurfers[lastIndex].on('destroy', hideProgress);
    wavesurfers[lastIndex].on('error', hideProgress);
});

var GLOBAL_ACTIONS = {};
for (var i = 0; i < wavesurferInfo.length; i++) {
    function playPause(i) {
        return function() { wavesurfers[i].playPause(); };
    }
    GLOBAL_ACTIONS[wavesurferInfo[i]['name'] + '-play'] = playPause(i);
}

function playPauseBoth() {
    return function() { wavesurfers[2].playPause(); wavesurfers[3].playPause() };
}
GLOBAL_ACTIONS['both-play'] = playPauseBoth();

// Bind actions to buttons
document.addEventListener('DOMContentLoaded', function () {
    [].forEach.call(document.querySelectorAll('[data-action]'), function (el) {
        el.addEventListener('click', function (e) {
            var action = e.currentTarget.dataset.action;
            if (action in GLOBAL_ACTIONS) {
                e.preventDefault();
                GLOBAL_ACTIONS[action](e);
            }
        });
    });
});

// Hack styling for piano + brain
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('bothWaveform').childNodes[1].style.opacity=0.5;
    document.getElementById('bothWaveform').childNodes[2].style.opacity=0.5;
    document.getElementById('bothWaveform').childNodes[1].style.position='absolute';
});

