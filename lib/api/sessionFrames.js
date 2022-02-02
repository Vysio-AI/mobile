// Module for interacting with the session frames API provided by api.vysio.ca
import { getRequest, postRequest } from './http';

const getSessionFrame = (frameId) => {
    return getRequest(`/session-frames/${frameId}`)
}

const getSessionFrames = (sessionId) => {
    return getRequest(`/sessions/${sessionId}/session-frames`);
}

export {
    getSessionFrame,
    getSessionFrames
}