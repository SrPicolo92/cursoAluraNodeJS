//biblioteca file system
const fs = require('fs')
const path = require('path')

module.exports = (caminho, nomeDoArquivo, callbackImagemCriada) => {
    const tiposValidos = ['jpg', 'png', 'jpeg']
    const tipo = path.extname(caminho)
    //Precisamos saber se o tipo que estão nos passado é um dos válidos.
    //Pegamos a substring 1 porque não queremos o '.', '.jpeg' => 'jpeg'
    //Se o tipo que nos foi passado não for encontrado na array dos Tipos válidos ele nos retorna com -1
    const isTipoInvalido = tiposValidos.indexOf(tipo.substring(1)) === -1
        
    if (isTipoInvalido)
    {
        const erro = 'Tipo é invalido'
        console.error('Erro! Tipo Inválido')
        callbackImagemCriada(erro)
    }
    else
    {
        const novoCaminho = './assets/imagens/' + nomeDoArquivo + tipo
        fs.createReadStream(caminho)
        .pipe(fs.createWriteStream(novoCaminho))
        .on('finish', () => callbackImagemCriada(false, novoCaminho))
    }
}


