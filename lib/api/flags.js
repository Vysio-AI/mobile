// Module for interacting with the flags API provided by api.vysio.ca
import { delRequest, getRequest, postRequest } from './http';

const getFlag = (flagId) => {
    return getRequest(`/flags/${flagId}`);
}

const createFlag = (time, notes, sessionId) => {
    return postRequest(`/flags`, {
        time: time,
        notes: notes,
        sessionId: sessionId
    });
}

const updateFlag = (flagId, updateData) => {
    return patchRequest(`/flags/${flagId}`, updateData);
}

const deleteFlag = (flagId) => {
    return delRequest(`/flags/${flagId}`);
}


export {
  getFlag,
  createFlag,
  updateFlag,
  deleteFlag
}