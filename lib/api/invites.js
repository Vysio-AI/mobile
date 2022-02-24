// Module for interacting with the invites API provided by api.vysio.ca
import { postRequest } from './http';

const validateReferral = (referralCode, accessToken) => {
    return postRequest(`/invites/referral`, {
        referralCode: referralCode
    }, accessToken);
}

export {
    validateReferral
}