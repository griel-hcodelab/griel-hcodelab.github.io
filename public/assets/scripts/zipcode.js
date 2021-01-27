import axios from 'axios';
import IMask from 'imask';
import { setFormValues } from './utils';

document.querySelectorAll(".zipcode").forEach(zipcode => {
    const page = zipcode.closest(".page")
    const formElement = page.querySelector("form");
    const zipcodeElement = page.querySelector("#zipcode");
    const btnZipcodeElement = page.querySelector("#btn-search");
    const numberElement = page.querySelector("#number");

    const searchZipcode = () => {
        const { value } = zipcodeElement;
        console.log(value);
        btnZipcodeElement.disabled = true;
        btnZipcodeElement.innerHTML = 'Buscando...';

        axios({
            url: `https://viacep.com.br/ws/${value.replace("-", "")}/json/`
        })
        .then(({data}) => { 
            let uf;
            switch (data.uf) {
                case "AC":
                  uf = "Acre";
                  break;
                case "AL":
                  uf = "Alagoas";
                  break;
                case "AP":
                  uf = "Amapá";
                  break;
                case "AM":
                  uf = "Amazonas";
                  break;
                case "BA":
                  uf = "Bahia";
                  break;
                case "CE":
                  uf = "Ceará";
                  break;
                case "DF":
                  uf = "Distrito Federal";
                  break;
                case "ES":
                  uf = "Espírito Santo";
                  break;
                case "GO":
                  uf = "Goiás";
                  break;
                case "MA":
                  uf = "Maranhão";
                  break;
                case "MT":
                  uf = "Mato Grosso";
                  break;
                case "MS":
                  uf = "Mato Grosso do Sul";
                  break;
                case "MG":
                  uf = "Minas Gerais";
                  break;
                case "PA":
                  uf = "Pará";
                  break;
                case "PB":
                  uf = "Paraíba";
                  break;
                case "PR":
                  uf = "Paraná";
                  break;
                case "PE":
                  uf = "Pernambuco";
                  break;
                case "PI":
                  uf = "Piauí";
                  break;
                case "RJ":
                  uf = "Rio de Janeiro";
                  break;
                case "RN":
                  uf = "Rio Grande do Norte";
                  break;
                case "RS":
                  uf = "Rio Grande do Sul";
                  break;
                case "RO":
                  uf = "Rondônia";
                  break;
                case "RR":
                  uf = "Roraima";
                  break;
                case "SC":
                  uf = "Santa Catarina";
                  break;
                case "SP":
                  uf = "São Paulo";
                  break;
                case "SE":
                  uf = "Sergipe";
                  break;
                case "TO":
                  uf = "Tocantins";
                  break;
            }
            setFormValues(formElement,{
                address: data.logradouro,
                complement: data.complemento,
                district: data.bairro,
                city: data.localidade,
                state: uf,
                country: "Brasil"
            });

            numberElement.focus()
        })
        .finally(()=>{
            btnZipcodeElement.disabled = false;
            btnZipcodeElement.innerHTML = 'Buscar';
        });
    };

    zipcodeElement.addEventListener("keyup", (e)=>{
        e.preventDefault();
        if (e.key === "Enter" || e.target.value.length >= 9) {
            searchZipcode();
        } 
    });

    btnZipcodeElement.addEventListener("click", (e)=>searchZipcode);

    formElement.addEventListener("submit", (e)=>{
        e.preventDefault();
    })

    new IMask(zipcodeElement, {
        mask:"00000-000"
    });

});