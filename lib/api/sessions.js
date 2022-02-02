// Module for interacting with the sessions API provided by api.vysio.ca
import { getRequest, postRequest } from './http';

const getSession = (sessionId) => {
  return getRequest(`/sessions/${sessionId}`);
}

const getSessions = (clientId) => {
  return getRequest(`/clients/${clientId}/sessions`);
}

const updateSession = (sessionId, updateData) => {
  return patchRequest(`/sessions/${sessionId}`, updateData);
}

const deleteSession = (sessionId) => {
  return delRequest(`/sessions/${sessionId}`);
}


export {
  getSession,
  getSessions,
  updateSession,
  deleteSession
}
