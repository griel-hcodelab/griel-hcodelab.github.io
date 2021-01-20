import firebase from './firebase-app';
import { appendTemplate, formatCurrency, getQueryString, setFormValues } from './utils';

let serviceSumary = [];

const renderServiceOptions = (context, serviceOptions)=>{
    const optionsEl = context.querySelector('.options');

    optionsEl.innerHTML = '';

    serviceOptions.forEach((item) => {
        const label = appendTemplate(optionsEl, 'label', `
        <input type="checkbox" name="service" value="${item.id}" />
        <div class="square">
            <div></div>
        </div>
        <div class="content">
            <span class="name">${item.name}</span>
            <span class="description">${item.description}</span>
            <span class="price">${formatCurrency(item.price)}</span>
        </div>`)
        label.querySelector('[type=checkbox]').addEventListener('change', (e)=>{
            
            const { value, checked } = e.target;

            if(checked) {

                const service = serviceOptions.filter((option)=>{
                    return (Number(option.id) === Number(value));
                })[0];

                serviceSumary.push(service.id);
                
            } else {
                serviceSumary = serviceSumary.filter((id)=>{
                    return Number(id) !== Number(value)
                });
            }

            /*serviceSumary.map((id) => serviceOptions.filter(item => (Number(item.id) === Number(id)))[0]).sort((a,b)=>{
                

                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1
                } else {
                    return 0
                }
            });
*/


            renderServiceSumary(context, serviceOptions);
        });
    }
    );

    
}

const renderServiceSumary = (context, serviceOptions)=>{

    const tbodyEl = context.querySelector("aside tbody");

    tbodyEl.innerHTML = '';

    serviceSumary
    .map((id)=>serviceOptions
    .filter((item)=>Number(item.id) === Number(id))[0])
    .sort((a,b)=> {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1
        } else {
            return 0
        }
    })
    .forEach((item)=>{

        appendTemplate(tbodyEl, 'tr', `
            <td>${item.name}</td>
            <td class="price">${formatCurrency(item.price)}</td>
        `);

    });

    const totalEl = context.querySelector("footer span.total");

    const result = serviceSumary.map((id)=>{
        return serviceOptions.filter((item)=>{
            return (Number(item.id) === Number(id));
        })[0];
    });

    const total = result.reduce((totalResult, item)=>{
        return eval(Number(totalResult) + Number(item.price))
    }, 0);

    totalEl.innerHTML = formatCurrency(total);
}


document.querySelectorAll("#schedules-service").forEach((page)=>{

    const db = firebase.firestore();

    db.collection('services').onSnapshot((snapshot)=>{
        
        const services = [];

        snapshot.forEach((item)=>{

           services.push(item.data());
            
        });

        renderServiceOptions(page, services);
    });

    const params = getQueryString();

    setFormValues(page.querySelector('form'), params);

    const $buttonSummary = page.querySelector("#btn-summary-toggle");

    $buttonSummary.addEventListener("click", (e)=>{
        page.querySelector("aside").classList.toggle('open')
    })

});