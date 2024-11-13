import { readFileSync } from 'fs';

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
  { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);}
    
function getPecas(pecas, apre) {
  return pecas[apre.id];
}

class ServicoCalculoFatura{
  calcularCredito(apre, pecas) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (pecas.tipo === "comedia")
    creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }
  
  CalcularTotalCredito(apresentacoes, pecas){
    let creditos = 0
    for (let apre of apresentacoes){
      creditos += this.calcularCredito(apre, getPecas(pecas, apre))
    }
    return creditos
  }
  
  calcularTotalApresentacao(pecas, apre) {
    let total = 0;
  
    switch (getPecas(pecas, apre).tipo) {
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
        throw new Error(`Peça desconhecia: ${getPecas(pecas, apre).tipo}`);
    }
    return total;
  }
  
  CalcularTotalFatura(pecas, apresentacoes){
    let totalFatura = 0
    for (let apre of apresentacoes){
      totalFatura += this.calcularTotalApresentacao(pecas, apre)
    }
    return totalFatura
  }
}

function gerarFaturaStr (fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPecas(pecas, apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.CalcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.CalcularTotalCredito(fatura.apresentacoes, pecas)} \n`;
  return faturaStr;
}

/* function gerarFaturaHTML(fatura, pecas){
  let faturaHtml = `<html> \n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;

  for (let apre of fatura.apresentacoes){
    faturaHtml += `<li> ${getPecas(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos) </li>\n`;
  }
  faturaHtml += `</ul>\n`;
  faturaHtml += `<p> Valor total: ${formatarMoeda(CalcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`;
  faturaHtml += `<p> Créditos acumulados: ${CalcularTotalCredito(fatura.apresentacoes, pecas)} </p>\n`;
  faturaHtml += `</html>\n`
  return faturaHtml;
} */

const calc = new ServicoCalculoFatura()
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);
// const faturaHTML = gerarFaturaHTML(faturas, pecas);
// console.log(faturaHTML);