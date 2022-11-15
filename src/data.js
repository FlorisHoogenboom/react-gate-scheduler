import _ from 'lodash';

const ROOT_URI = 'http://localhost:8000';

export async function getTurnarounds() {
    const endpoint = new URL(`/turnarounds`, ROOT_URI);

    const response = await window.fetch(endpoint, {
        method: 'GET',
    });

    return _.keyBy(await response.json(), 'id');
}

