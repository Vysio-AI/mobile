// Module for interacting with the sessions API provided by api.vysio.ca
import { getRequest, patchRequest, delRequest } from './http';

const getSession = (sessionId, accessToken) => {
  return getRequest(`/sessions/${sessionId}`, accessToken);
}

const getSessions = (accessToken) => {
  return getRequest(`/sessions`, accessToken);
}

const updateSession = (sessionId, updateData, accessToken) => {
  return patchRequest(`/sessions/${sessionId}`, updateData, accessToken);
}

const deleteSession = (sessionId, accessToken) => {
  return delRequest(`/sessions/${sessionId}`, accessToken);
}


export {
  getSession,
  getSessions,
  updateSession,
  deleteSession
}
