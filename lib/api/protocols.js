// Module for interacting with the protocols API provided by api.vysio.ca
import { delRequest, getRequest, patchRequest, postRequest } from './http';

const getProtocol = (protocolId) => {
    return getRequest(`/protocols/${protocolId}`);
}

const getProtocols = (clientId) => {
    return getRequest(`/clients/${clientId}/protocols`);
}

const createProtocol = (clientId, frequency, active = false) => {
    return postRequest(`/protocols`, {
        clientId: clientId,
        completionFrequency: frequency,
        active: active,
    });
}

const updateProtocol = (protocolId, updateData) => {
    return patchRequest(`/protocols/${protocolId}`, updateData);
}

const deleteProtocol = (protocolId) => {
    return delRequest(`/protocols/${protocolId}`);
}

export {
    getProtocol,
    getProtocols,
    createProtocol,
    updateProtocol,
    deleteProtocol
}