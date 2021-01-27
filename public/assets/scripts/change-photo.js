
import Cropper from 'cropperjs';
import firebase from "./firebase-app";


document.querySelectorAll("#change-photo").forEach(page=>{
    //Recorte de Imagem
    let cropper = null;
    
    let userGlobal = null;
    const imageElement = page.querySelector("#photo-preview");
    const buttonElement = page.querySelector(".choose-photo");
    const inputFileElement = page.querySelector("input[type=file]");
    const form = page.querySelector("form");
    const btnSubmit = form.querySelector("[type=submit]");
    const bodyElement = document.body;

    const auth = firebase.auth();

    const uploadFile = files=>{
        if (files.length) {
            const file = files[0];

            const reader = new FileReader();

            reader.onload = ()=>{
                imageElement.src = reader.result;

                //Recorte de Imagem
                imageElement.closest("form").classList.add('cropping');
                cropper = new Cropper(imageElement, {
                    aspectRatio: 1 / 1,
                    /*crop(event){
                        console.log(event);
                        Colocar detalhes do crop no formulário
                    }*/
                });
            }

            reader.readAsDataURL(file);

            
        }
    }

    auth.onAuthStateChanged(user=>{
        if (user) {
            userGlobal = user;
            imageElement.src = user.photoURL || "https://i.pravatar.cc/256";
        } 
    });

    bodyElement.addEventListener("drop", (e)=>{
        e.preventDefault();
        uploadFile(e.dataTransfer.files);
    });
    bodyElement.addEventListener("dragover", (e)=>{e.preventDefault();});

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        form.classList.remove('cropping');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = 'Salvando...';

        //Recorte de Imagem
        imageElement.src = cropper.getCroppedCanvas().toDataURL("image/png");
        cropper.getCroppedCanvas().toBlob((blob)=>{
            const storage = firebase.storage();
            const fileRef = storage.ref().child(`photos/${userGlobal.uid}.png`);
            fileRef
            .put(blob)
            .then((snapshot)=>snapshot.ref.getDownloadURL())
            .then(photoURL => userGlobal.updateProfile({ photoURL })) //se o objeto e valor forem iguais ao da variavel, pode usar só 1x
            .then(()=>{
                console.log(userGlobal)
                userGlobal.photoURL;
                document.querySelector("#header > div.menu.logged > div > div > picture > a > img").src = userGlobal.photoURL;
            });

            cropper.destroy();
        });

        btnSubmit.disabled = false;
        btnSubmit.innerHTML = 'Salvar';
    })

    

    imageElement.addEventListener("click", (e)=>{
        inputFileElement.click();
    });
    buttonElement.addEventListener("click", (e)=>{
        inputFileElement.click();
    });

    inputFileElement.addEventListener("change", (e)=>{

        uploadFile(e.target.files.length);

        e.target.value = '';
    });
});