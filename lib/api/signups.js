// Module for interacting with the signup API provided by api.vysio.ca
import { getRequest, postRequest } from './http';

const signupPractitioner = (firstName, lastName, email) => {
    return postRequest('/practitioners/signup', {
        firstName: firstName,
        lastName: lastName,
        email: email,
    });
}

const getSignupStatus = () => {
    return getRequest('/signup-status');
}

export {
    signupPractitioner,
    getSignupStatus
}