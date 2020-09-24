'use strict';
const togglePopUp = () => {

    const body = document.body,
        PopUpCall = document.querySelector('.popup-call');

    body.addEventListener('click', (e) => {
        const target = e.target;
        //открытие модального окна по кнопке "перезвоните"
        if (target.closest('.call-btn')) {
            e.preventDefault();
            PopUpCall.style.cssText = "display:block;opacity:1;";
            PopUpCall.classList.add("active-popup");
        } else if (target.closest('.popup-close')) {
            //закрытие модального окна по крестику
            target.closest('.active-popup').removeAttribute('style');
            target.closest('.active-popup').classList.remove('active-popup');
        } else if (target.closest('.active-popup') && !target.closest('.popup-content')) {
            //закрытие модального окна по подложке
            target.closest('.active-popup').removeAttribute('style');
            target.closest('.active-popup').classList.remove('active-popup');
        }
    });
};
export default togglePopUp;