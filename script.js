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
});

let entradaRegistrada = null;
let saidaRegistrada = null;
document.getElementById('entrada').addEventListener('click', () => {
    if (entradaRegistrada === null) {
        entradaRegistrada = {
            data: document.getElementById('data-dialog').textContent,
            hora: document.getElementById('hora-dialog').textContent
        };
        mostrarNotificacao(`Entrada registrada em: ${entradaRegistrada.data} as ${entradaRegistrada.hora}`);
    } else {
        mostrarNotificacao('Voce ja registrou a entrada!');
    }
});



document.getElementById('saida').addEventListener('click', () => {
    if (entradaRegistrada === null) {
        mostrarNotificacao('Voce precisa registrar uma entrada antes de registrar uma saida!');
    } else if (saidaRegistrada === null) {
        saidaRegistrada = {
            data: document.getElementById('data-dialog').textContent,
            hora: document.getElementById('hora-dialog').textContent
        };
        mostrarNotificacao(`Saida registrada em: ${saidaRegistrada.data} às ${saidaRegistrada.hora}`);
    } else {
        mostrarNotificacao('Você ja registrou a saida!');
    }
});

let pausas = [];
let inicioPausa = null;

document.getElementById('inicio-pausa').addEventListener('click', () => {
    if (entradaRegistrada === null) {
        mostrarNotificacao('Voce precisa registrar uma entrada antes de iniciar uma pausa!');
    } else if (inicioPausa !== null) {
        mostrarNotificacao('Você ja iniciou uma pausa!');
    } else {
        inicioPausa = new Date();
        mostrarNotificacao(`Pausa iniciada em: ${document.getElementById('data-dialog').textContent} às ${document.getElementById('hora-dialog').textContent}`);
    }
});

document.getElementById('fim-pausa').addEventListener('click', () => {
    if (inicioPausa === null) {
        mostrarNotificacao('Voce precisa iniciar uma pausa antes de finaliza-la!');
    } else {
        const fimPausa = new Date();
        const pausa = {
            inicio: inicioPausa,
            fim: fimPausa
        };
        pausas.push(pausa);
        inicioPausa = null;
        mostrarNotificacao(`Pausa finalizada em: ${document.getElementById('data-dialog').textContent} às ${document.getElementById('hora-dialog').textContent}`);
    }
});

document.getElementById('verificar').addEventListener('click', () => {
    const entradaInfo = document.getElementById('info-entrada');
    const saidaInfo = document.getElementById('info-saida');
    const pausaInfo = document.getElementById('info-pausa');
    const tempoTotalPausaInfo = document.getElementById('tempo-total-pausa');

    if (entradaRegistrada === null) {
        entradaInfo.textContent = 'Nenhuma entrada registrada.';
        saidaInfo.textContent = '';
        pausaInfo.textContent = '';
        tempoTotalPausaInfo.textContent = '';
    } else {
        entradaInfo.textContent = `Entrada registrada em: ${entradaRegistrada.data} às ${entradaRegistrada.hora}`;
        if (saidaRegistrada !== null) {
            saidaInfo.textContent = `Saída registrada em: ${saidaRegistrada.data} às ${saidaRegistrada.hora}`;
        } else {
            saidaInfo.textContent = 'Nenhuma saida registrada.';
        }

        if (pausas.length > 0) {
            pausaInfo.textContent = 'Pausas registradas:';
            let tempoTotalPausa = 0;
            pausas.forEach((pausa, index) => {
                const duracaoPausa = (pausa.fim - pausa.inicio) / 1000 / 60; // /60 = para colocar em minutos
                pausaInfo.textContent += `\nPausa ${index + 1}: Inicio as ${pausa.inicio.toLocaleTimeString()} - Fim as ${pausa.fim.toLocaleTimeString()} (Duracao: ${duracaoPausa.toFixed(2)} minutos)`;
                tempoTotalPausa += duracaoPausa;
            });
            tempoTotalPausaInfo.textContent = `Tempo total em pausa: ${tempoTotalPausa.toFixed(2)} minutos`;
        } else {
            pausaInfo.textContent = 'Nenhuma pausa registrada.';
            tempoTotalPausaInfo.textContent = '';
        }
    }

    dialogVerificar.showModal();
});

//TODO = Se abrir pausa, nao fechar e registrar saida o final da pausa deve ser o mesmo do registro saida.

const dialogVerificar = document.getElementById('dialog-verificar');
const botaoFecharVerificar = document.getElementById('fechar-verificar');
botaoFecharVerificar.addEventListener('click', () => {
    dialogVerificar.close();
});

function mostrarNotificacao(message) {
    const notificacao = document.getElementById('notification');
    notificacao.textContent = message;
    notificacao.classList.add('show');
    notificacao.classList.remove('hidden');

    setTimeout(() => {
        notificacao.classList.remove('show');
        notificacao.classList.add('hidden');
    }, 3000);
}
