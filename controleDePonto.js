/* 
Alunos: Raul Falluh Fragoso de Mendonca e Rodrigo Lemos
Matriculas: Raul - 22300926 | Rodrigo - 22301814
Professor: Airton Bordin Junior
Materia: Programação para Web - Turma A - 0724 - Matutino
*/

document.addEventListener("DOMContentLoaded", () => {
  const pontoRegistroBtn = document.getElementById("pontoRegistroBtn");
  const entradaSaidaIntervaloBtn = document.getElementById("entradaSaidaIntervaloBtn");
  const pontoRetroativoBtn = document.getElementById("pontoRetroativoBtn");
  const justificativaInput = document.getElementById("justificativaInput");
  const observacaoInput = document.getElementById("observacaoInput");
  const justificativaArquivo = document.getElementById("justificativaArquivo");
  const dataRetroativaInput = document.getElementById("dataRetroativa");
  const localizacaoAtual = document.getElementById("localizacaoAtual");

  let expedienteAberto = false;
  let intervaloAberto = false;
  let expedienteId = JSON.parse(localStorage.getItem("expedienteId")) || 0;

  const updateDateTime = () => {
    const now = new Date();
    const horaLocal = now.toLocaleString("pt-BR", { timeZoneName: "short" });
    document.getElementById("dataHoraAtual").textContent = horaLocal;
  };
  setInterval(updateDateTime, 1000);

  const mostrarNotificacao = (mensagem) => {
    const notificacao = document.getElementById("notificacao");
    notificacao.textContent = mensagem;
    notificacao.classList.add("mostrar");
    notificacao.classList.remove("hidden");

    setTimeout(() => {
      notificacao.classList.remove("mostrar");
      notificacao.classList.add("hidden");
    }, 3000);
  };

  const salvarPonto = (tipo, dataHora, localizacao, justificativa = "", observacao = "", justificativaArquivoURL = "", retroativo = false) => {
    let pontos = JSON.parse(localStorage.getItem("pontos")) || [];
    let pontoExpedienteId = retroativo ? null : expedienteId;

    pontos.push({ tipo, dataHora, localizacao, justificativa, observacao, justificativaArquivoURL, retroativo, expedienteId: pontoExpedienteId });
    localStorage.setItem("pontos", JSON.stringify(pontos));
    if (!retroativo) localStorage.setItem("expedienteId", expedienteId);
    mostrarNotificacao(`Ponto de ${tipo} registrado com sucesso!`);
  };

  const obterLocalizacao = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const localizacao = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
          localizacaoAtual.textContent = localizacao;
          callback(localizacao);
        },
        () => {
          mostrarNotificacao("Não foi possível obter a localização.");
          callback("Localização indisponível");
        }
      );
    } else {
      mostrarNotificacao("Geolocalização não é suportada pelo navegador.");
      callback("Localização indisponível");
    }
  };

  pontoRegistroBtn.addEventListener("click", () => {
    const dataHoraAtual = new Date().toISOString();
    const justificativaArquivoURL = justificativaArquivo.files.length > 0 ? URL.createObjectURL(justificativaArquivo.files[0]) : "";

    obterLocalizacao((localizacao) => {
      if (!expedienteAberto) {
        expedienteAberto = true;
        salvarPonto("entrada", dataHoraAtual, localizacao, justificativaInput.value, observacaoInput.value, justificativaArquivoURL);
        mostrarNotificacao("Expediente iniciado.");
      } else {
        if (intervaloAberto) {
          salvarPonto("saida_intervalo", dataHoraAtual, localizacao, justificativaInput.value, observacaoInput.value, justificativaArquivoURL);
          intervaloAberto = false;
          mostrarNotificacao("Intervalo encerrado automaticamente ao fechar o expediente.");
        }

        expedienteAberto = false;
        salvarPonto("saida", dataHoraAtual, localizacao, justificativaInput.value, observacaoInput.value, justificativaArquivoURL);
        mostrarNotificacao("Expediente encerrado.");
        expedienteId++;
        localStorage.setItem("expedienteId", expedienteId);
      }
    });
  });

  entradaSaidaIntervaloBtn.addEventListener("click", () => {
    const dataHoraAtual = new Date().toISOString();
    const justificativaArquivoURL = justificativaArquivo.files.length > 0 ? URL.createObjectURL(justificativaArquivo.files[0]) : "";

    if (!expedienteAberto) {
      mostrarNotificacao("Você precisa iniciar o expediente antes de iniciar um intervalo.");
      return;
    }

    obterLocalizacao((localizacao) => {
      if (!intervaloAberto) {
        intervaloAberto = true;
        salvarPonto("entrada_intervalo", dataHoraAtual, localizacao, justificativaInput.value, observacaoInput.value, justificativaArquivoURL);
        mostrarNotificacao("Intervalo iniciado.");
      } else {
        intervaloAberto = false;
        salvarPonto("saida_intervalo", dataHoraAtual, localizacao, justificativaInput.value, observacaoInput.value, justificativaArquivoURL);
        mostrarNotificacao("Intervalo encerrado.");
      }
    });
  });

  pontoRetroativoBtn.addEventListener("click", () => {
    const dataRetroativa = dataRetroativaInput.value;
    if (!dataRetroativa) {
      mostrarNotificacao("Por favor, selecione uma data e hora retroativa.");
      return;
    }

    const dataHoraRetroativa = new Date(dataRetroativa);
    const agora = new Date();

    if (dataHoraRetroativa > agora) {
      mostrarNotificacao("Não é possível registrar um ponto para uma data futura.");
      return;
    }

    const justificativaArquivoURL = justificativaArquivo.files.length > 0 ? URL.createObjectURL(justificativaArquivo.files[0]) : "";

    obterLocalizacao((localizacao) => {
      salvarPonto("retroativo", dataHoraRetroativa.toISOString(), localizacao, justificativaInput.value, observacaoInput.value, justificativaArquivoURL, true);

      justificativaInput.value = "";
      observacaoInput.value = "";
      justificativaArquivo.value = "";
      dataRetroativaInput.value = "";
    });
  });
});

document.getElementById('visualizarRelatorioBtn').addEventListener('click', function () {
  window.open('relatorio.html', '_blank');
});
