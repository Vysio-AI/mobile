// Module for interacting with the clients API provided by api.vysio.ca
import { delRequest, getRequest, patchRequest, postRequest } from './http';

const getClient = (clientId, accessToken) => {
    return getRequest(`/clients/${clientId}`, accessToken);
}

const getClients = () => {
    return getRequest(`/clients`);
}

const updateClient = (updateData) => {
    return patchRequest(`/clients/${clientId}`, updateData);
}

const deleteClient = () => {
    return delRequest(`/clients/${clientId}`);
}

export {
    getClient,
    getClients,
    updateClient,
    deleteClient
}