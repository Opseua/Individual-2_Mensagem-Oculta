// Identificar elementos do HTML //
const ele_lista_expandida = document.getElementById("lista_expandida");
const ele_texto_incremento = document.getElementById("texto_incremento");
const ele_barra_deslizante = document.getElementById("barra_deslizante");
const ele_modo_automatico = document.getElementById("modo_automatico");
const ele_formulario_1 = document.getElementById("formulario_1");
const ele_formulario_2 = document.getElementById("formulario_2");
const ele_botao = document.getElementById("botao_submit");


// Monitor de eventos: acionar quando a MULTIPLA ESCOLHA (CODIFICAR ou DECODIFICAR) for alterada //
document.addEventListener('input', (e) => {

  if (e.target.getAttribute('name') == "multipla_escolha")
    if (e.target.value === "encrypt") {

      // Alterar texto de fundo dos formulários (quando a opção CODIFICAR estiver marcada) //
      ele_formulario_1.placeholder = " Texto para codificar...";
      ele_formulario_2.placeholder = " Resultado codificado sairá aqui";
      ele_botao.textContent = "   Codificar Mensagem!   ";
      ele_botao.style.backgroundColor = "#aa1e1e";
      ele_botao.style.color = "white";

    }
    else {

      // Alterar texto de fundo dos formulários (quando a opção DECODIFICAR estiver marcada) //
      ele_formulario_1.placeholder = " Texto para decodificar...";
      ele_formulario_2.placeholder = " Resultado decodificado sairá aqui";
      ele_botao.textContent = " Decodificar Mensagem! ";
      ele_botao.style.backgroundColor = "#267506";
      ele_botao.style.color = "white";

    }
})

// Monitor de eventos: acionar quando a LISTA EXPANDIDA (CIFRA DE CÉSAR ou BASE64) for alterada //
ele_lista_expandida.addEventListener('change', (event) => {

  if (ele_lista_expandida.value === 'base64') {

    // Ocultar opção de incremento Cifra de César (quando for BASE64) //
    ele_texto_incremento.style.visibility = "hidden";
    ele_barra_deslizante.style.visibility = "hidden";

  } else {

    // Mostrar opção de incremento Cifra de César  //
    ele_texto_incremento.style.visibility = "visible";
    ele_barra_deslizante.style.visibility = "visible";

  }
});


// Monitor de eventos: acionar quando a Barra deslizante (incremento Cifra de César) for alterada //
ele_barra_deslizante.addEventListener("input", function () {
  ele_texto_incremento.innerHTML = "INCREMENTO: " + ele_barra_deslizante.value;
}, false);


// Monitor de eventos: acionar quando o modo MANUAL ou AUTOMÁTICO for alterado //
ele_modo_automatico.addEventListener('change', (event) => {

  if (ele_modo_automatico.value === 'manual') {

    // Mostrar o botão para CODIFICAR ou DECODIFICAR (quando for o modo MANUAL) //
    ele_botao.style.visibility = "visible";

  } else {

    // Ocultar o botão para CODIFICAR ou DECODIFICAR (quando for o modo AUTOMÁTICO) //
    ele_botao.style.visibility = "hidden";

  }
});


// Monitor de eventos: acionar quando o botão CODIFICAR ou DECODIFICAR for pressionado //
document.getElementById("botao_submit").addEventListener("click", function (event) {
  encrypt_decrypt()
}
);


// Monitor de eventos: acionar quando qualquer edição for feita no formulário 1 (apagando ou escrevendo) //
ele_formulario_1.addEventListener('input', checkautomatico);
ele_formulario_1.addEventListener('propertychange', checkautomatico);

function checkautomatico() {

  // Executar somente se o modo for AUTOMÁTICO //
  if (ele_modo_automatico.value === "automatico") {
    encrypt_decrypt()
  }
}


// Encrypt-Decrypt BASE64 e CIFRA DE CÉSAR //
function encrypt_decrypt() {

  const val_multipla_escolha = document.querySelector('input[name="multipla_escolha"]:checked').value;
  const val_lista_expandida = ele_lista_expandida.value;
  const val_barra_deslizante = ele_barra_deslizante.value;
  const val_formulario_1 = ele_formulario_1.value;

  // Iniciar o encrypt
  if (val_multipla_escolha === "encrypt") {

    // Modo: BASE64 //
    if (val_lista_expandida === "base64") {

      const aMyUTF8Input = strToUTF8Arr(val_formulario_1);
      const sMyBase64 = base64EncArr(aMyUTF8Input);
      ele_formulario_2.value = sMyBase64;

    }

    // Modo: CIFRA DE CÉSAR //
    if (val_lista_expandida === "cifra_de_cesar") {

      ele_formulario_2.value = (caesar(val_formulario_1, val_barra_deslizante))

    }

  }
  // Iniciar o decrypt
  else {

    // Modo: BASE64 //
    if (val_lista_expandida === "base64") {

      const aMyUTF8Output = base64DecToArr(val_formulario_1);
      const sMyOutput = UTF8ArrToStr(aMyUTF8Output);
      ele_formulario_2.value = sMyOutput;

    }

    // Modo: CIFRA DE CÉSAR //
    if (val_lista_expandida === "cifra_de_cesar") {

      val_barra_deslizante_novo = Number(val_barra_deslizante)
      val_barra_deslizante_novo = (val_barra_deslizante_novo - (val_barra_deslizante_novo * 2))
      ele_formulario_2.value = (caesar(val_formulario_1, val_barra_deslizante_novo))

    }

  }

}



// ######################################################################################################################## //



// Script para processar em CIFRA DE CÉSAR (origem: Google) //
const caesar = function (word, num) {
  let solved = ""
  num = (num % 26 + 26) % 26;
  for (let i = 0; i < word.length; i++) {
    let ascii = word[i].charCodeAt();
    if ((ascii >= 65 && ascii <= 90)) {
      solved += String.fromCharCode((ascii - 'A'.charCodeAt(0) + num) % 26
        + 'A'.charCodeAt(0));
    } else if (ascii >= 97 && ascii <= 122) {
      solved += String.fromCharCode((ascii - 'a'.charCodeAt(0) + num) % 26
        + 'a'.charCodeAt(0));
    } else {
      solved += word[i]
    }
  }
  return solved;
}



// Script para processar em BASE64 (origem: Google) //
"use strict";
// Array of bytes to Base64 string decoding
function b64ToUint6(nChr) {
  return nChr > 64 && nChr < 91
    ? nChr - 65
    : nChr > 96 && nChr < 123
      ? nChr - 71
      : nChr > 47 && nChr < 58
        ? nChr + 4
        : nChr === 43
          ? 62
          : nChr === 47
            ? 63
            : 0;
}

function base64DecToArr(sBase64, nBlocksSize) {
  const sB64Enc = sBase64.replace(/[^A-Za-z0-9+/]/g, "");
  const nInLen = sB64Enc.length;
  const nOutLen = nBlocksSize
    ? Math.ceil(((nInLen * 3 + 1) >> 2) / nBlocksSize) * nBlocksSize
    : (nInLen * 3 + 1) >> 2;
  const taBytes = new Uint8Array(nOutLen);

  let nMod3;
  let nMod4;
  let nUint24 = 0;
  let nOutIdx = 0;
  for (let nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3;
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << (6 * (3 - nMod4));
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      nMod3 = 0;
      while (nMod3 < 3 && nOutIdx < nOutLen) {
        taBytes[nOutIdx] = (nUint24 >>> ((16 >>> nMod3) & 24)) & 255;
        nMod3++;
        nOutIdx++;
      }
      nUint24 = 0;
    }
  }

  return taBytes;
}

/* Base64 string to array encoding */
function uint6ToB64(nUint6) {
  return nUint6 < 26
    ? nUint6 + 65
    : nUint6 < 52
      ? nUint6 + 71
      : nUint6 < 62
        ? nUint6 - 4
        : nUint6 === 62
          ? 43
          : nUint6 === 63
            ? 47
            : 65;
}

function base64EncArr(aBytes) {
  let nMod3 = 2;
  let sB64Enc = "";

  const nLen = aBytes.length;
  let nUint24 = 0;
  for (let nIdx = 0; nIdx < nLen; nIdx++) {
    nMod3 = nIdx % 3;
    if (nIdx > 0 && ((nIdx * 4) / 3) % 76 === 0) {
      sB64Enc += "\r\n";
    }

    nUint24 |= aBytes[nIdx] << ((16 >>> nMod3) & 24);
    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
      sB64Enc += String.fromCodePoint(
        uint6ToB64((nUint24 >>> 18) & 63),
        uint6ToB64((nUint24 >>> 12) & 63),
        uint6ToB64((nUint24 >>> 6) & 63),
        uint6ToB64(nUint24 & 63)
      );
      nUint24 = 0;
    }
  }
  return (
    sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) +
    (nMod3 === 2 ? "" : nMod3 === 1 ? "=" : "==")
  );
}

/* UTF-8 array to JS string and vice versa */

function UTF8ArrToStr(aBytes) {
  let sView = "";
  let nPart;
  const nLen = aBytes.length;
  for (let nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx];
    sView += String.fromCodePoint(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen /* six bytes */
        ? /* (nPart - 252 << 30) may be not so safe in ECMAScript! So…: */
        (nPart - 252) * 1073741824 +
        ((aBytes[++nIdx] - 128) << 24) +
        ((aBytes[++nIdx] - 128) << 18) +
        ((aBytes[++nIdx] - 128) << 12) +
        ((aBytes[++nIdx] - 128) << 6) +
        aBytes[++nIdx] -
        128
        : nPart > 247 && nPart < 252 && nIdx + 4 < nLen /* five bytes */
          ? ((nPart - 248) << 24) +
          ((aBytes[++nIdx] - 128) << 18) +
          ((aBytes[++nIdx] - 128) << 12) +
          ((aBytes[++nIdx] - 128) << 6) +
          aBytes[++nIdx] -
          128
          : nPart > 239 && nPart < 248 && nIdx + 3 < nLen /* four bytes */
            ? ((nPart - 240) << 18) +
            ((aBytes[++nIdx] - 128) << 12) +
            ((aBytes[++nIdx] - 128) << 6) +
            aBytes[++nIdx] -
            128
            : nPart > 223 && nPart < 240 && nIdx + 2 < nLen /* three bytes */
              ? ((nPart - 224) << 12) +
              ((aBytes[++nIdx] - 128) << 6) +
              aBytes[++nIdx] -
              128
              : nPart > 191 && nPart < 224 && nIdx + 1 < nLen /* two bytes */
                ? ((nPart - 192) << 6) + aBytes[++nIdx] - 128
                : /* nPart < 127 ? */ /* one byte */
                nPart
    );
  }
  return sView;
}

function strToUTF8Arr(sDOMStr) {
  let aBytes;
  let nChr;
  const nStrLen = sDOMStr.length;
  let nArrLen = 0;

  /* mapping… */
  for (let nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
    nChr = sDOMStr.codePointAt(nMapIdx);

    if (nChr > 65536) {
      nMapIdx++;
    }

    nArrLen +=
      nChr < 0x80
        ? 1
        : nChr < 0x800
          ? 2
          : nChr < 0x10000
            ? 3
            : nChr < 0x200000
              ? 4
              : nChr < 0x4000000
                ? 5
                : 6;
  }

  aBytes = new Uint8Array(nArrLen);

  /* transcription… */
  let nIdx = 0;
  let nChrIdx = 0;
  while (nIdx < nArrLen) {
    nChr = sDOMStr.codePointAt(nChrIdx);
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr;
    } else if (nChr < 0x800) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x10000) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12);
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x200000) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18);
      aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
      nChrIdx++;
    } else if (nChr < 0x4000000) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24);
      aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
      nChrIdx++;
    } /* if (nChr <= 0x7fffffff) */ else {
      /* six bytes */
      aBytes[nIdx++] = 252 + (nChr >>> 30);
      aBytes[nIdx++] = 128 + ((nChr >>> 24) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 18) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 12) & 63);
      aBytes[nIdx++] = 128 + ((nChr >>> 6) & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
      nChrIdx++;
    }
    nChrIdx++;
  }

  return aBytes;
}




