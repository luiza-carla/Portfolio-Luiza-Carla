function ajustarAlturaInicio(){
    const inicio = document.querySelector('.container');
    container.style.height = `${window.innerHeight}px`;

    window.addEventListener('load', ajustarAlturaInicio);
    window.addEventListener('resize', ajustarAlturaInicio);
}