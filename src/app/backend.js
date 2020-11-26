import * as styles from './index.scss';
const https = require('https');


const client_id = 'CLIENT_ID';
const client_sercet = 'CLIENT_SECRET';
const cloud_ux_ip = 'CLOUDUX_HOST_IP';
const basic_path = '/auth';
const basic_headers = {
    'Content-type': 'application/json; charset=UTF-8',
    'Accept': 'application/json',
};
const ctms_registry_path = '/apis/avid.ctms.registry;version=0;realm=global';
const base64data = 'Basic ' + Buffer.from(client_id + ':' + client_sercet).toString('base64');
const headers_auth = {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': base64data,
};
const details = {
    grant_type : 'password',
    username : 'username',
    password : 'password',
};
const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
let count = 0;


async function get_url(upstream, path, headers, method, postData = '') {
    return new Promise((resolve, reject) => {
        const url_request = https.request(
            {
                host: upstream,
                path: path,
                method: method,
                headers: headers,
            },

            (result) => {
                result.on('data', (d) => {
                    const result_link = JSON.parse(d);
                    resolve(result_link);
                });
            });

        url_request.on('error', (error) => {
            console.log('ERROR ' + error);
        });
        url_request.write(postData);

        url_request.end();
    });
}


function find_by_sys_name(serviceroot, str, sys_name) {
    let result = '';
    for (let i = 0; i < serviceroot.resources[str].length; i++) {
        if (serviceroot.resources[str][i].href.includes(sys_name)) {
            result = serviceroot.resources[str][i].href;
        }
    }
    return result;
}


const main_func = async (story_id, table, no_notific_p) => {
    let auth = await get_url(cloud_ux_ip, basic_path, basic_headers, 'GET');
    auth = auth._links['auth:identity-providers'][0].href;
    let sso_link = await get_url(cloud_ux_ip, new URL(auth).pathname, basic_headers, 'GET');
    sso_link = sso_link._embedded['auth:identity-provider'][2]._links['auth:ropc-default'][0].href;
    let access_token = await get_url(cloud_ux_ip, new URL(sso_link).pathname, headers_auth, 'POST', formBody);
    access_token = access_token.access_token;
    const request_headers = {
        'Content-Type': 'application/hal+json;charset=UTF-8',
        Authorization: ' Bearer ' + access_token,
    };
    
    let ctms_registry = await get_url(cloud_ux_ip, ctms_registry_path, request_headers, 'GET');
    ctms_registry = ctms_registry._links['registry:serviceroots'].href;
    ctms_registry = ctms_registry.split('{')[0];
    const serviceroot = await get_url(cloud_ux_ip, new URL(ctms_registry).pathname, request_headers, 'GET');
    const inews_queues_link = find_by_sys_name(serviceroot, 'ia:queues', 'avid.inews');
    let inews_subscribe_to_queue = await get_url(cloud_ux_ip, new URL(inews_queues_link).pathname, request_headers, 'GET');
    inews_subscribe_to_queue = inews_subscribe_to_queue._links['ia:subscribe-to-queue-notifications-by-id'].href;
    inews_subscribe_to_queue = inews_subscribe_to_queue.split('{')[0];

    await get_url(cloud_ux_ip, new URL(inews_subscribe_to_queue).pathname + story_id + '/notifications/subscribe', request_headers, 'POST');
    
    const wsock = new WebSocket('wss://' + cloud_ux_ip + '/notifications?consumer=auth-token');
    
    wsock.addEventListener('message', function (event) {
        const parsed_data = JSON.parse(event.data);
        if (parsed_data.data.modified) {
            const notific_row = document.createElement('TR');
            notific_row.setAttribute('name', 'notific_row');
            
            const col_num = document.createElement('TD');
            col_num.classList.add(styles.col_num);

            const col_s_id = document.createElement('TD');
            col_s_id.classList.add(styles.col_s_id);

            const col_q_id = document.createElement('TD');
            col_q_id.classList.add(styles.col_q_id); 

            no_notific_p.style.display = 'none';
            count += 1;
            col_num.innerHTML = count;
            col_s_id.innerHTML = parsed_data.data.modified[0].storyId;
            col_q_id.innerHTML = parsed_data.data.queueId;
            
            notific_row.appendChild(col_num);
            notific_row.appendChild(col_s_id);
            notific_row.appendChild(col_q_id);
            table.appendChild(notific_row);
        }
    });
};


function reset_count() {
    count = 0;
}

export { main_func, reset_count };
