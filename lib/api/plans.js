// Module for interacting with the Plans API provided by api.vysio.ca
import { delRequest, getRequest, patchRequest, postRequest } from './http';

const getPlan = (planId, accessToken) => {
    return getRequest(`/plans/${planId}`, accessToken);
}

const getPlans = (clientId, accessToken) => {
    return getRequest(`/clients/${clientId}/plans?limit=10&offset=0`, accessToken);
}

const createPlan = (clientId, frequency, active = false, accessToken) => {
    return postRequest(`/plans`, {
        clientId: clientId,
        completionFrequency: frequency,
        active: active,
    }, accessToken);
}

const updatePlan = (planId, updateData, accessToken) => {
    return patchRequest(`/plans/${planId}`, updateData, accessToken);
}

const deletePlan = (planId, accessToken) => {
    return delRequest(`/plans/${planId}`, accessToken);
}

export {
    getPlan,
    getPlans,
    createPlan,
    updatePlan,
    deletePlan
}