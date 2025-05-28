function ajustarAlturaInicio(){
    const inicio = document.querySelector('.container');
    if(inicio){
    inicio.style.height = `${window.innerHeight}px`;
    }
}
window.addEventListener('load', ajustarAlturaInicio);
window.addEventListener('resize', ajustarAlturaInicio);