import { readFileSync } from 'fs';

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
  { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);}

class ServicoCalculoFatura{
  constructor(repo){
    this.repo = repo;
  }

  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.repo.getPecas(apre).tipo === "comedia")
    creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }
  
  CalcularTotalCredito(apresentacoes){
    let creditos = 0
    for (let apre of apresentacoes){
      creditos += this.calcularCredito(apre)
    }
    return creditos
  }
  
  calcularTotalApresentacao(apre) {
    let total = 0;
  
    switch (this.repo.getPecas(apre).tipo) {
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
        throw new Error(`Peça desconhecia: ${this.repo.getPecas(apre).tipo}`);
    }
    return total;
  }
  
  CalcularTotalFatura(apresentacoes){
    let totalFatura = 0
    for (let apre of apresentacoes){
      totalFatura += this.calcularTotalApresentacao(apre)
    }
    return totalFatura
  }
}

class Repositorio{
  constructor(){
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPecas(apre) {
    return this.pecas[apre.id];
  }

}

function gerarFaturaStr (fatura) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;

  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${calc.repo.getPecas(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.CalcularTotalFatura(fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.CalcularTotalCredito(fatura.apresentacoes)} \n`;
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

const calc = new ServicoCalculoFatura(new Repositorio())
const faturas = JSON.parse(readFileSync('./faturas.json'));
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
// const faturaHTML = gerarFaturaHTML(faturas, pecas);
// console.log(faturaHTML);