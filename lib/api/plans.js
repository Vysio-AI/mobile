// Module for interacting with the Plans API provided by api.vysio.ca
import { delRequest, getRequest, patchRequest, postRequest } from './http';

const getPlan = (planId, accessToken) => {
    return getRequest(`/plans/${planId}`, accessToken);
}

const getPlans = (clientId, accessToken) => {
    return getRequest(`/clients/${clientId}/plans`, accessToken);
}

const getAllExercisesForPlan = (planId, accessToken) => {
    return getRequest(`/plans/${planId}/exercises`, accessToken);
}

const getAllSessionsForPlan = (planId, accessToken) => {
    return getRequest(`/plans/${planId}/sessions`, accessToken);
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
    getAllExercisesForPlan,
    getAllSessionsForPlan,
    createPlan,
    updatePlan,
    deletePlan
}