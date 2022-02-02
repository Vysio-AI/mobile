// Module for interacting with the organizations API provided by api.vysio.ca
import { delRequest, getRequest, postRequest } from './http';

const getOrganization = (orgId) => {
    return getRequest(`/organizations/${orgId}`);
}

const getOrganizationPractitioners = (orgId) => {
    return getRequest(`/organizations/${orgId}/practitioners`);
}

const getOrganizations = () => {
    return getRequest(`/organizations`);
}

const updateOrganization = (orgId, updateData) => {
    return patchRequest(`/organizations/${orgId}`, updateData);
}

const deleteOrganization = (orgId) => {
    return delRequest(`/organizations/${orgId}`);
}


export {
    getOrganization,
    getOrganizations,
    getOrganizationPractitioners,
    updateOrganization,
    deleteOrganization
}