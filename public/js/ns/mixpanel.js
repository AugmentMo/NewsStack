mixpanel.init('50c39f0643d7aedd6aec85435b9a48d9', {debug: true, ignore_dnt: true}); 

const clkbl = {
    "Add Stack button": "#addnewsstackbtn",
    "Login link": "#loginbtn",
    "Profile dropdown toggle": ".userprofiledropdown .dropdown-toggle",
    "Logout button": ".btn-logout",
    "GitHub repository link": ".footer a"
};


function trk(trgt, evt) {
    mixpanel.track(evt, {
        "target": trgt
    });
}
function trkclk(qsel, trgt, evt) {
    $(qsel).on(evt, (event) => {
        mixpanel.track(evt, {
            "target": trgt
        });
    });
}

function trkclkbl() {
    for (const k in clkbl) {
        trkclk(clkbl[k], k, "click");
    }
}

function settid(tid) {
    mixpanel.identify(tid)
}

trkclkbl();
