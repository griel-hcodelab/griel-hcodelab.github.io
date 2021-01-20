import { format, parse } from "date-fns";
import { appendTemplate, getFormValues, getQueryString, setFormValues } from "./utils";
import firebase from './firebase-app';
import { ptBR } from "date-fns/locale";


const renderTimeOptions = (context, timeOptions) => {

    const targetElement = context.querySelector(".options");

    targetElement.innerHTML = "";

    timeOptions.forEach((item)=> {
        appendTemplate(
            targetElement, 
            "label", 
            `<input type="radio" name="option" value="${item.value}" /> <span>${item.value}</span>`
        );
    });



};


const validateSubmitForm = (context) => {

    const button = context.querySelector("[type=submit]");

    const checkValue = ()=>{
        if (!context.querySelector("[name=option]:checked")) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }

    window.addEventListener("load", () => checkValue());

    context.querySelectorAll("[name=option]").forEach(input => {

        input.addEventListener("change", () => {

            //button.disabled = !context.querySelector("[name=option]:checked")
            checkValue()            

        })

    })

    context.querySelector("form").addEventListener("submit", e => {
        if (!context.querySelector("[name=option]:checked")) {
            button.disabled = true
            e.preventDefault()
        } else {
            button.disabled = false
        }
    })
};

document.querySelectorAll("#schedules-time-options").forEach((page)=>{

    const db = firebase.firestore();

    db.collection('time-options').onSnapshot((snapshot)=>{
        
        const timeOptions = [];

        snapshot.forEach((item)=>{

           timeOptions.push(item.data());
            

        });

        renderTimeOptions(page, timeOptions);
        validateSubmitForm(page);
    });

    

    const params = getQueryString();
    const title = page.querySelector("h3");
    const form = page.querySelector("form");
    const scheduleAt = parse(params.schedule_at, "yyyy-MM-dd", new Date());

    //page.querySelector("[name=schedule_at]").value = params.schedule_at;

    setFormValues(form, params);


    title.innerHTML = format(scheduleAt, "EEEE, d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
});

