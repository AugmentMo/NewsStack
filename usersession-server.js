// Users sessions, consisting of SID, SocketID pairs
// Array of dicts: {sid: string, socketid: string, sub : string}
var usersessions = []

/**
 * Checks if a user session is existing with the given SID.
 *
 * @param {*} sid SID of the user session
 * @return {*} true if existing, false if not
 */
function isUserSessionExisting(sid) {
    for (const s of usersessions) {
        if (s.sid === sid) {
            return true;
        }
    }

    return false;
}

/**
 * Creates a user session with the given SID, if not existing already.
 *
 * @param {*} sid SID of the user session
 */
function createUserSession(sid, sub) {
    if (!isUserSessionExisting(sid)) {
        // Creating new user session, with empty socketid
        const newusersession = {sid: sid, sub: sub, socketid: null}
        usersessions.push(newusersession);
    }
}

/**
 * Adds the SocketID to the SID SocketID user session pair.
 *
 * @param {*} sid sid of the user session
 * @param {*} socketid SocketID of the user session
 */
function updateUserSessionSocketID(sid, socketid) {
    for (const s of usersessions) {
        if (s.sid === sid) {
            s.socketid = socketid;
            break;
        }
    }
}

/**
 * Removes a user session with the given SID.
 *
 * @param {*} sid SID of the user session
 */
function removeUserSession(sid) {
    usersessions = usersessions.filter(s => s.sid !== sid);
}

/**
 * Finds the matching SID for a given SocketID for the user session.
 *
 * @param {*} socketid SocketID of the user session
 * @return {*} SID if match found, else null
 */
function getUserSessionSID(socketid) {
    for (const s of usersessions) {
        if (s.socketid == socketid) {
            return s.sid;
        }
    }

    return null;
}


/**
 * Returns the sub id for a given session id.
 *
 * @param {*} sid the sid of the user session
 */
function getUserSubID(sid) {
    for (const s of usersessions) {
        if (s.sid == sid) {
            return s.sub;
        }
    }

    return null;
}

module.exports = { createUserSession, updateUserSessionSocketID, removeUserSession, getUserSessionSID, isUserSessionExisting, getUserSubID };
