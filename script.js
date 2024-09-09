function atualizarDataHora() {
    const dataHora = new Date();
    const local = navigator.language;

    let dataFormatada = dataHora.toLocaleDateString(local, { dateStyle: 'full' });
    const horaFormatada = dataHora.toLocaleTimeString(local, { timeStyle: 'medium' });

    dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    document.getElementById('data').textContent = dataFormatada;
    document.getElementById('hora').textContent = horaFormatada;

    document.getElementById('data-dialog').textContent = dataFormatada;
    document.getElementById('hora-dialog').textContent = horaFormatada;
}

atualizarDataHora();
setInterval(atualizarDataHora, 1000);

const dialog = document.getElementById('dialog');
const overlay = document.getElementById('overlay');
const botaoFechar = document.getElementById('fechar');

document.querySelector('.botao_ponto').addEventListener('click', () => {
    atualizarDataHora();
    overlay.classList.add('visible'); // Mostra o fundo depois de clicar no Registrar Ponto
    dialog.showModal();
    dialog.classList.add('animar-entrada');
    dialog.classList.remove('animar-saida');
});

botaoFechar.addEventListener('click', () => {
    dialog.classList.add('animar-saida');
    overlay.classList.remove('visible'); // Tira o fundo quando fecha (clica fora, no X ou ESC)
    setTimeout(() => dialog.close(), 500);
});

dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
        botaoFechar.click();
    }
});

overlay.addEventListener('click', () => {
    botaoFechar.click();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog.open) {
        botaoFechar.click();
    }
}); // Remove o fundo caso clique ESC

document.getElementById('entrada').addEventListener('click', () => {
    alert(`Entrada registrada em: ${document.getElementById('data-dialog').textContent} às ${document.getElementById('hora-dialog').textContent}`);
});

document.getElementById('saida').addEventListener('click', () => {
    alert(`Saída registrada em: ${document.getElementById('data-dialog').textContent} às ${document.getElementById('hora-dialog').textContent}`);
});
