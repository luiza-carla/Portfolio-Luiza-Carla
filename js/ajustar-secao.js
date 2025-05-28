function ajustarAlturaInicio(){
    const inicio = document.querySelector('.container');
    inicio.style.height = `${window.innerHeight}px`;

    window.addEventListener('load', ajustarAlturaInicio);
    window.addEventListener('resize', ajustarAlturaInicio);
}