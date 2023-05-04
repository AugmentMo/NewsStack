// Users sessions, consisting of SID, SocketID pairs
// Array of dicts: {sid: string, socketid: string}
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
function createUserSession(sid) {
    if (!isUserSessionExisting(sid)) {
        // Creating new user session, with empty socketid
        const newusersession = {sid: sid, socketid: null}
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

module.exports = { createUserSession, updateUserSessionSocketID, removeUserSession, getUserSessionSID };
