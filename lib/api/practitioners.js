// Module for interacting with the practitioners API provided by api.vysio.ca
import { delRequest, getRequest, patchRequest, postRequest } from './http';

const getPractitioner = (practitionerId) => {
    return getRequest(`/practitioners/${practitionerId}`);
}

const getPractitioners = () => {
    return getRequest(`/practitioners`);
}

const getPractitionerClients = (practitionerId) => {
    return getRequest(`/practitioners/${practitionerId}/clients`);
}

const updatePractitioner = (practitionerId, updateData) => {
    return patchRequest(`/practitioners/${practitionerId}`, updateData);
}

const deletePractitioner = (practitionerId) => {
    return delRequest(`/practitioners/${practitionerId}`);
}


export {
    getPractitioner,
    getPractitioners,
    getPractitionerClients,
    updatePractitioner,
    deletePractitioner
}