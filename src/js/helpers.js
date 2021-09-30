import { async } from "regenerator-runtime";
import { TIMEOUT_SECONDS } from "./config";
const timeout = (s) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Request Took too long! timeout after ${s} second`));
        }, s * 1000);
    });
};

export const getJSON = async function (url) {
    try {
        const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
        const data = await response.json();
        if (!response.ok) throw new Error(`${data.message} ${response.status}`)
        return data;
    } catch (err) {
        throw err;
    }
}