import jsonServerProvider from "ra-data-json-server";
import { fetchUtils } from 'react-admin';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers();
    }
    if (localStorage.getItem('token')) {
        options.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    }
    return fetchUtils.fetchJson(url, options);
};

const dataProvider = jsonServerProvider(new URL("/api", location.href).href, httpClient);

export default dataProvider;
