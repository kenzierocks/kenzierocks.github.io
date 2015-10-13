
// Begin stuff
$(function onReady() {
    $("#loading").remove();
    var firebase = new Firebase("https://pasteitall.firebaseio.com/");
    var pastes = firebase.child("pastes");
    var location = getQueryStringKey("loc");
    var showContent = function doShowContent(content) {
        // split+join for replaceAll. nicely done js
        $("#paste").append($("<p></p>").html(escapeHtml(content).split("\n").join("<br>")));
    };
    if (location !== undefined) {
        var locs = location.split("/");
        var group = locs[0];
        var id = locs[1];
        var content = pastes.child(group).child(id).child("content");
        content.once("value", function(snapshot) {
            console.log(snapshot + "LOADED");
            showContent(snapshot.val());
        }, function (err) {
            showContent("No content");
        });
    } else {
        showContent("No content");
    }
});

// look, I stole stuff from StackOverflow
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}
getQueryStringKey = function getQSKey(key) {
    var obj = getQueryStringAsObject();
    console.log(obj);
    console.log(window.location.search.substring(1));
    return obj ? obj[key] : obj;
};


getQueryStringAsObject = function getQSObject() {
    var b, cv, e, k, ma, sk, v, r = {},
        d = function (v) { return decodeURIComponent(v).replace(/\+/g, " "); }, //# d(ecode) the v(alue)
        q = window.location.search.substring(1),
        s = /([^&;=]+)=?([^&;]*)/g //# original regex that does not allow for ; as a delimiter:   /([^&=]+)=?([^&]*)/g
        ;

    //# ma(make array) out of the v(alue)
    ma = function(v) {
        //# If the passed v(alue) hasn't been setup as an object
        if (typeof v != "object") {
            //# Grab the cv(current value) then setup the v(alue) as an object
            cv = v;
            v = {};
            v.length = 0;

            //# If there was a cv(current value), .push it into the new v(alue)'s array
            //#     NOTE: This may or may not be 100% logical to do... but it's better than loosing the original value
            if (cv) { Array.prototype.push.call(v, cv); }
        }
        return v;
    };

    //# While we still have key-value e(ntries) from the q(uerystring) via the s(earch regex)...
    while (e = s.exec(q)) { //# while((e = s.exec(q)) !== null) {
        //# Collect the open b(racket) location (if any) then set the d(ecoded) v(alue) from the above split key-value e(ntry)
        b = e[1].indexOf("[");
        v = d(e[2]);

        //# As long as this is NOT a hash[]-style key-value e(ntry)
        if (b < 0) { //# b == "-1"
            //# d(ecode) the simple k(ey)
            k = d(e[1]);

            //# If the k(ey) already exists
            if (r[k]) {
                //# ma(make array) out of the k(ey) then .push the v(alue) into the k(ey)'s array in the r(eturn value)
                r[k] = ma(r[k]);
                Array.prototype.push.call(r[k], v);
            }
            //# Else this is a new k(ey), so just add the k(ey)/v(alue) into the r(eturn value)
            else {
                r[k] = v;
            }
        }
        //# Else we've got ourselves a hash[]-style key-value e(ntry)
        else {
            //# Collect the d(ecoded) k(ey) and the d(ecoded) sk(sub-key) based on the b(racket) locations
            k = d(e[1].slice(0, b));
            sk = d(e[1].slice(b + 1, e[1].indexOf("]", b)));

            //# ma(make array) out of the k(ey)
            r[k] = ma(r[k]);

            //# If we have a sk(sub-key), plug the v(alue) into it
            if (sk) { r[k][sk] = v; }
            //# Else .push the v(alue) into the k(ey)'s array
            else { Array.prototype.push.call(r[k], v); }
        }
    }

    //# Return the r(eturn value)
    return r;
};
