/* 
Alunos: Raul Falluh Fragoso de Mendonca e Rodrigo Lemos
Matriculas: Raul - 22300926 | Rodrigo - 22301814
Professor: Airton Bordin Junior
Materia: Programação para Web - Turma A - 0724 - Matutino
*/

let pontoIndexAtual = null;
let expedienteIdAtual = null;

document.addEventListener("DOMContentLoaded", () => {
  carregarPontos();

  document.getElementById("periodFilter").addEventListener("change", (e) => {
    const periodo = e.target.value;
    carregarPontos(periodo);
  });
});

function carregarPontos(periodo = "all") {
  const relatorioContainer = document.getElementById("relatorioContainer");
  relatorioContainer.innerHTML = "";
  const pontos = JSON.parse(localStorage.getItem("pontos")) || [];

  const pontosFiltrados = filtrarPontosPorPeriodo(pontos, periodo);

  const expedientes = pontosFiltrados.reduce((acc, ponto) => {
    const pontoExpedienteId = ponto.expedienteId !== null ? ponto.expedienteId : `Retroativo_${acc.retroativoCount++}`;
    if (!acc.expedientes[pontoExpedienteId]) {
      acc.expedientes[pontoExpedienteId] = { pontos: [], tipo: ponto.tipo };
    }
    acc.expedientes[pontoExpedienteId].pontos.push(ponto);
    return acc;
  }, { expedientes: {}, retroativoCount: 1 });

  Object.keys(expedientes.expedientes).forEach((expedienteId) => {
    const expedienteDiv = document.createElement("div");
    expedienteDiv.classList.add("expediente-container");
    const h3 = document.createElement("h3");
    h3.textContent = `Expediente nº: ${expedienteId}`;
    expedienteDiv.appendChild(h3);

    expedientes.expedientes[expedienteId].pontos.forEach((ponto, index) => {
      const pontoData = new Date(ponto.dataHora);
      const pontoDiv = document.createElement("div");
      pontoDiv.classList.add("ponto-item");

      if (ponto.observacao) {
        pontoDiv.classList.add("ponto-observacao");
      }

      pontoDiv.innerHTML = `
        <p><b>Tipo:</b> ${ponto.tipo || "Tipo não especificado"}</p>
        <p><b>Data e Hora:</b> ${pontoData.toLocaleString('pt-BR')}</p>
        <p><b>Justificativa:</b> ${ponto.justificativa || "Nenhuma"}</p>
        <p><b>Observação:</b> ${ponto.observacao || "Nenhuma"}</p>
        ${ponto.justificativaArquivoURL ? `<a href="${ponto.justificativaArquivoURL}" target="_blank">Ver Justificativa</a>` : ""}
        <button onclick="editarPonto(${index}, '${expedienteId}')">Editar</button>
        <button onclick="excluirPonto(${index}, '${expedienteId}')">Excluir</button>
      `;
      if (ponto.retroativo) pontoDiv.style.color = "blue";
      expedienteDiv.appendChild(pontoDiv);
    });

    relatorioContainer.appendChild(expedienteDiv);
  });
}

function filtrarPontosPorPeriodo(pontos, periodo) {
  const agora = new Date();
  let dataInicio;

  if (periodo === "lastWeek") {
    dataInicio = new Date();
    dataInicio.setDate(agora.getDate() - 7);
  } else if (periodo === "lastMonth") {
    dataInicio = new Date();
    dataInicio.setMonth(agora.getMonth() - 1);
  }

  if (periodo === "all") {
    return pontos;
  }

  return pontos.filter((ponto) => {
    const dataPonto = new Date(ponto.dataHora);
    return dataPonto >= dataInicio && dataPonto <= agora;
  });
}

function editarPonto(index, expedienteId) {
  const pontos = JSON.parse(localStorage.getItem("pontos"));
  const pontosFiltrados = pontos.filter(p =>
    p.expedienteId === (expedienteId.startsWith("Retroativo") ? null : parseInt(expedienteId))
  );

  pontoIndexAtual = index;
  expedienteIdAtual = expedienteId;
  const ponto = pontosFiltrados[index];

  if (ponto) {
    document.getElementById("editDataHora").value = new Date(ponto.dataHora).toISOString().slice(0, 16);
    document.getElementById("editJustificativa").value = ponto.justificativa || "";
    document.getElementById("editObservacao").value = ponto.observacao || "";
    abrirModal();
  } else {
    mostrarNotificacao("Ponto não encontrado para edição.");
  }
}

function abrirModal() {
  document.getElementById("editModal").style.display = "block";
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

function salvarEdicao() {
  const pontos = JSON.parse(localStorage.getItem("pontos"));
  const ponto = pontos.filter(p => p.expedienteId === (expedienteIdAtual.startsWith("Retroativo") ? null : parseInt(expedienteIdAtual)))[pontoIndexAtual];

  if (ponto) {
    ponto.dataHora = document.getElementById("editDataHora").value;
    ponto.justificativa = document.getElementById("editJustificativa").value;
    ponto.observacao = document.getElementById("editObservacao").value;

    localStorage.setItem("pontos", JSON.stringify(pontos));
    closeModal();
    location.reload();
    mostrarNotificacao("Alterações salvas com sucesso.");
  } else {
    mostrarNotificacao("Erro ao salvar as alterações.");
  }
}

function excluirPonto(index, expedienteId) {
  mostrarNotificacao("A exclusão de registros de ponto não é permitida.");
}

function mostrarNotificacao(mensagem) {
  const notificacao = document.getElementById("notificacao");
  notificacao.textContent = mensagem;
  notificacao.classList.add("mostrar");
  notificacao.classList.remove("hidden");

  setTimeout(() => {
    notificacao.classList.remove("mostrar");
    notificacao.classList.add("hidden");
  }, 3000);
}
