import { readFileSync } from 'fs';

function gerarFaturaStr (fatura, pecas) {
  let totalFatura = 0;
  let creditos = 0
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPecas(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(CalcularTotalFatura())}\n`;
  faturaStr += `Créditos acumulados: ${CalcularTotalCredito()} \n`;
  return faturaStr;
  
  
  function getPecas(apresentacao) {
    return pecas[apresentacao.id];
  }

  function CalcularTotalCredito(){
    for (let apre of fatura.apresentacoes){
      creditos += calcularCredito(apre, getPecas(apre))
    }
    return creditos
  }

  function CalcularTotalFatura(){
    for (let apre of fatura.apresentacoes){
      totalFatura += calcularTotalApresentacao(apre)
    }
    return totalFatura
  }

  function calcularTotalApresentacao(apre) {
    let total = 0;

    switch (getPecas(apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecia: ${getPecas(apre).tipo}`);
    }
    return total;
  }
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);
}

function calcularCredito(apre, getPecas) {
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPecas.tipo === "comedia")
    creditos += Math.floor(apre.audiencia / 5);
  return creditos;
}