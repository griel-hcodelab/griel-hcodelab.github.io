import IMask from 'imask';
import { getQueryString, setFormValues } from './utils';

document.querySelectorAll("#schedules-payment").forEach(page => {
    const form = page.querySelector("form");
    const number = page.querySelector("#number");
    const name = page.querySelector("#name");
    const expiry = page.querySelector("#expiry");
    const document = page.querySelector("#document");
    const inputCvv = page.querySelector("#cvv");
    const creditCart = page.querySelector("#credit-card")
    const svgCvv = page.querySelector('svg .cvv');
    const svgName = page.querySelector('svg .name');
    const svgNumber1 = page.querySelector('svg .number-1');
    const svgNumber2 = page.querySelector('svg .number-2');
    const svgNumber3 = page.querySelector('svg .number-3');
    const svgNumber4 = page.querySelector('svg .number-4');
    const svgExpiry = page.querySelector('svg .expiry');


    setFormValues(form, getQueryString());

    

    number.addEventListener("keyup", (e)=>{
        const numberString = number.value.replaceAll(' ', '')
        svgNumber1.innerHTML = numberString.substr(0,4);
        svgNumber2.innerHTML = numberString.substr(4,4);
        svgNumber3.innerHTML = numberString.substr(8,4);
        svgNumber4.innerHTML = numberString.substr(12,4);
    })

    

    name.addEventListener("keyup", (e)=>{
        svgName.innerHTML = name.value.toUpperCase()
    });
    expiry.addEventListener("keyup", (e)=>{
        svgExpiry.innerHTML = expiry.value
    });
    inputCvv.addEventListener("keyup", (e)=>{
        svgCvv.innerHTML = inputCvv.value
    });

    creditCart.addEventListener("click", (e)=>{
        creditCart.classList.toggle('flipped')
    })

    new IMask(number, {
        mask:"0000 0000 0000 0000"
    });
    new IMask(expiry, {
        mask:"00/00"
    });
    new IMask(cvv, {
        mask:"000[0]" //colchete é número opcional
    });
    new IMask(document, {
        mask:"000.000.000-00" //colchete é número opcional
    });

    inputCvv.addEventListener("focus", e=>{
        creditCart.classList.add('flipped')
    })
    inputCvv.addEventListener("blur", e=>{
        creditCart.classList.remove('flipped')
    })

    page.querySelectorAll("input").forEach((input)=>{
        input.addEventListener("focus", (e)=>{
            page.classList.add("keyboard-open");
        });
        input.addEventListener("blur", (e)=>{   
            page.classList.remove("keyboard-open");
        });
    })
});