
import { main_func, reset_count } from './backend';
import * as styles from './index.scss';

export default class ApplicationContainer {
    getTitle() {
        return 'Your first AVID app title';
    }

    render(element) {
        const div_container = document.createElement('DIV');

        const p_in_c = document.createElement('P');
        p_in_c.innerHTML = 'Enter INEWS queue ID: ';
        p_in_c.classList.add(styles.notif_p);

        const div2 = document.createElement('DIV');

        const input = document.createElement('INPUT');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'SHOW.6AM.RUNDOWN');
        input.classList.add(styles.input_class);
        
        const btn = document.createElement('BUTTON');
        btn.classList.add(styles.notif_button);
        btn.innerHTML = 'Subscribe';

        element.appendChild(div_container);
        div2.appendChild(p_in_c);
        div2.appendChild(input);
        div2.appendChild(btn);
        div_container.appendChild(div2);

        const div_notifications = document.createElement('DIV');

        const clear_btn = document.createElement('BUTTON');
        clear_btn.classList.add(styles.clear_btn);
        clear_btn.innerHTML = 'Clear all';

        const table = document.createElement('TABLE');
        table.setAttribute('id', 'Notific_table');
        table.classList.add(styles.notif_table);

        const headers = document.createElement('TR');
        headers.classList.add(styles.notif_headers);

        const num = document.createElement('TH');
        num.classList.add(styles.notif_num);
        const num_text = document.createTextNode('Number');
        num.appendChild(num_text);
        
        const s_id_header = document.createElement('TH');
        s_id_header.classList.add(styles.notif_s_id);
        const s_id_text = document.createTextNode('StoryID');
        s_id_header.appendChild(s_id_text);
       
        const q_id = document.createElement('TH');
        q_id.classList.add(styles.notif_q_id);
        const q_id_text = document.createTextNode('QueueID');
        q_id.appendChild(q_id_text);

        const notific_tr = document.createElement('TR');
        notific_tr.classList.add(styles.notific_tr);

        const no_notific_p = document.createElement('TD');
        no_notific_p.setAttribute('colspan', '3');
        no_notific_p.classList.add(styles.no_notific_p);
        no_notific_p.innerHTML = 'No Notifications';

        headers.appendChild(num);
        headers.appendChild(s_id_header);
        headers.appendChild(q_id);
        
        notific_tr.appendChild(no_notific_p);
        
        table.appendChild(headers);
        table.appendChild(notific_tr);
        
        div_notifications.appendChild(clear_btn);
        div_notifications.appendChild(table);
        div_container.appendChild(div_notifications);


        btn.addEventListener('click', function () {
            const div_message = document.createElement('DIV');
            div_message.classList.add(styles.message);
            div2.appendChild(div_message);
            
            const p_message = document.createElement('P');
            const q_name = input.value;
            main_func(q_name, table, no_notific_p);
            p_message.innerHTML = 'You\'ve subscribed to ' + q_name;
            const close_btn = document.createElement('BUTTON');
            close_btn.classList.add(styles.close_btn);
            close_btn.innerHTML = 'X';
            
            close_btn.addEventListener('click', function () {
                div_message.remove();
            });

            div_message.appendChild(p_message);
            div_message.appendChild(close_btn);
        });

        clear_btn.addEventListener('click', function () {
            const elements = document.getElementsByName('notific_row');
            
            while(elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
            
            no_notific_p.style.display = '';
            reset_count();
        });
    }
}
