import { sec } from '../auth/security';

const getAccessToken = async () => {
    const accessToken = await sec.getAccessTokenSilently()({
        audience: REACT_APP_AUTH0_AUDIENCE,
    });
    console.log(accessToken);
    return accessToken;
}

const postRequest = async (url, data = {}) => {
    const token = await getAccessToken();
    const fullUrl = API_BASE_URL + url;

    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error(`POST request to ${url} gave a bad response`);
    }
    return response.json();
}

const getRequest = async (url) => {
    const token = await getAccessToken();
    const fullUrl = API_BASE_URL + url;

    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    console.log(response);
    if (!response.ok) {
        throw new Error(`GET request to ${url} gave a bad response`);
    }
    return response.json();
}

const delRequest = async (url) => {
    const token = await getAccessToken();
    const fullUrl = API_BASE_URL + url;

    const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    if (!response.ok) {
        throw new Error(`DELETE request to ${url} gave a bad response`);
    }
    return response.json();
}

const patchRequest = async (url, data = {}) => {
    const token = await getAccessToken();
    const fullUrl = API_BASE_URL + url;

    const response = await fetch(fullUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error(`PATCH request to ${url} gave a bad response`);
    }
    return response.json();
}

export {
    postRequest,
    getRequest,
    delRequest,
    patchRequest
}