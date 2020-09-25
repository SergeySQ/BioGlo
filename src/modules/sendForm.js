"use strict";
const sendForm = () => {
    const statusMessage = document.createElement('img');
    statusMessage.src = './img/ajax-loader.gif';
    const successMessage = document.createElement('div'),
        errorMessage = document.createElement('div');
    errorMessage.style.cssText = 'font-size: 2rem;';
    errorMessage.textContent = 'Ошибка';
    successMessage.style.cssText = 'font-size: 2rem;';
    successMessage.textContent = 'Ваша заявка принята';


    //маска
    function maskPhone(selector, masked = '+7 (___) ___-__-__') {
        const elems = document.querySelectorAll(selector);

        function mask(event) {
            const keyCode = event.keyCode;
            const template = masked,
                def = template.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, "");
            let i = 0,
                newValue = template.replace(/[_\d]/g, a => (i < val.length ? val.charAt(i++) || def.charAt(i) : a));
            i = newValue.indexOf("_");
            if (i !== -1) {
                newValue = newValue.slice(0, i);
            }
            let reg = template.substr(0, this.value.length).replace(/_+/g,
                a => "\\d{1," + a.length + "}").replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                this.value = newValue;
            }
            if (event.type === "blur" && this.value.length < 5) {
                this.value = "";
            }

        }

        for (const elem of elems) {
            elem.addEventListener("input", mask);
            elem.addEventListener("focus", mask);
            elem.addEventListener("blur", mask);
        }

    }

    //применение маски для номеров
    maskPhone('input[name="user_phone"]');
    //запрет ввода в инпуте "номера" всего кроме цифр
    document.querySelectorAll('input[name="user_phone"]').forEach((item) => {
        item.addEventListener('input', () => {
            item.value = item.value.replace(/^[-()]\d/g, '');
        });
    });
    //запрет ввода в инпуте "имя" латиницы и цифр
    document.querySelectorAll('input[name="user_name"]').forEach((item) => {
        item.addEventListener("input", () => {
            item.value = item.value.replace(/[^а-яА-яёЁ]/g, '');
        });
    });
    //ajax отправка формы
    //для каждой формы
    document.querySelectorAll('form').forEach(form => {
        form.querySelector('button[type="submit"]').disabled = true;
        form.querySelectorAll('input').forEach(item => {
            item.addEventListener('input', () => {
                //блокировка кнопки отправки, если недостаточно цифр
                if (form.querySelector('input[name = "user_phone"]')) {
                    if (form.querySelector('input[name = "user_phone"]').value.length === 18) {
                        form.querySelector('button[type="submit"]').disabled = false;
                    } else {
                        form.querySelector('button[type="submit"]').disabled = true;
                    }

                    if (form.querySelector('button[type="submit"]').disabled) {
                        if (form.querySelector('input[name = "user_phone"]').value.length !== 18) {
                            form.querySelector('input[name = "user_phone"]').style.cssText = 'border:2px solid red;';
                        } else {
                            form.querySelector('input[name = "user_phone"]').style.cssText = 'border: 1px solid #ddd; border-radius: 5px;';
                        }

                    } else {
                        form.querySelector('input[name="user_phone"]').style.cssText = 'border: 1px solid #ddd; border-radius: 5px;';
                    }
                }

            });
        });
        //отправка формы
        form.addEventListener('submit', e => {
            e.preventDefault();
            form.appendChild(statusMessage);
            const formData = new FormData(form);
            const body = {};
            formData.forEach((val, key) => {
                body[key] = val;
            });
            postData(body)
                .then(response => {
                    if (response.status !== 200) {
                        throw new Error('status network not 200.');
                    }
                    form.removeChild(statusMessage);
                    form.appendChild(successMessage);
                })
                .catch(error => {
                    form.removeChild(statusMessage);
                    form.appendChild(errorMessage);
                    console.error(error);
                });
        });
    });
    //функция запроса на сервер
    const postData = body => fetch('./server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

};
export default sendForm;