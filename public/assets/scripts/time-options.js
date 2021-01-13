import { format, parse } from "date-fns";
import { appendTemplate, getFormValues, getQueryString, setFormValues } from "./utils";
import { ptBR } from "date-fns/locale";


const data = [{
        id: 1,
        value: '08:00'
    }, {
        id: 2,
        value: '09:00'
    },
    {
        id: 3,
        value: '11:00'
    },
    {
        id: 4,
        value: '12:00'
    },
    {
        id: 5,
        value: '13:00'
    },
    {
        id: 6,
        value: '14:00'
    },
    {
        id: 7,
        value: '15:00'
    }
];

const renderTimeOptions = (context) => {

    const targetElement = context.querySelector(".options");

    targetElement.innerHTML = "";

    data.forEach((item)=> {
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
        e.preventDefault()
        console.log(getFormValues(e.target));
        if (!context.querySelector("[name=option]:checked")) {
            button.disabled = true
            e.preventDefault()
        }

    })
};

document.querySelectorAll("#schedules-time-options").forEach((page)=>{
    renderTimeOptions(page)

    validateSubmitForm(page);

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

