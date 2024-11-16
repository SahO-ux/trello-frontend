import axios from 'axios';
// import config from '../config';
// import { is_new_server_api } from './newServerAPIs.js';
export function HTTP(method, uri, data, headers = null, fullUrl) {
    return new Promise((resolve, reject) => {
        const url = `${process.env.REACT_APP_API_URL}${uri}`.trim();;
        // if (!uri && fullUrl) {
        //     url = fullUrl;
        // }
        // else {
        //     url = `${config.baseUrl}${uri}`.trim();
        // }

        const query = {
            method: method,
            url: url
        }

        if (headers != null) {
            query.headers = headers;
        }
        if (method === 'post' || method === 'put' || method === 'delete'|| method === 'PATCH') {
            query.data = data;
        }
        axios(query).then(function(response) {
          resolve(response);
        })
        .catch((error) => {
            reject(error)
        })
    })
}