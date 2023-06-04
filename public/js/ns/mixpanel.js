var mixpanel_initialised = false;
var mixpanel_tid = undefined;

function initMixpanel(token) {
    mixpanel.init(token, { debug: true, ignore_dnt: true });     
    if (mixpanel_tid != undefined) {
        mixpanel.identify(mixpanel_tid)
    }
    mixpanel_initialised = true;
}


const clkbl = {
    "Add Stack button": "#addnewsstackbtn",
    "Login link": "#loginbtn",
    "Profile dropdown toggle": ".userprofiledropdown .dropdown-toggle",
    "Logout button": ".btn-logout",
    "GitHub repository link": ".footer a"
};


function trk(trgt, evt) {
    if (mixpanel_initialised) {
        mixpanel.track(evt, {
            "target": trgt
        });
    }
}
function trkclk(qsel, trgt, evt) {
    $(qsel).on(evt, (event) => {
        if (mixpanel_initialised) {
            mixpanel.track(evt, {
                "target": trgt
            });
        }
    });
}

function trkclkbl() {
    for (const k in clkbl) {
        trkclk(clkbl[k], k, "click");
    }
}

function settid(tid) {
    mixpanel_tid = tid;
    
    if (mixpanel_initialised) {
        mixpanel.identify(tid)
    }
}

trkclkbl();
