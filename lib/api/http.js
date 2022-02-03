import {API_BASE_URL} from "@env"

const postRequest = async (url, data = {}, accessToken) => {
    const fullUrl = API_BASE_URL + url;

    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error(`POST request to ${url} gave a bad response`);
    }
    return response.json();
}

const getRequest = async (url, accessToken) => {
    const fullUrl = API_BASE_URL + url;

    const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    })
    console.log(response);
    if (!response.ok) {
        throw new Error(`GET request to ${url} gave a bad response`);
    }
    return response.json();
}

const delRequest = async (url, accessToken) => {
    const fullUrl = API_BASE_URL + url;

    const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    })
    if (!response.ok) {
        throw new Error(`DELETE request to ${url} gave a bad response`);
    }
    return response.json().catch(err => {
        return {}
    });
}

const patchRequest = async (url, data = {}, accessToken) => {
    const fullUrl = API_BASE_URL + url;

    const response = await fetch(fullUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
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