//importando Conexao
const conexao = require('../infraestrutura/database/conexao')
//importando uploadDeArquivos
const uploadDeArquivos = require('../infraestrutura/arquivos/uploadDeArquivos')

class Pet {
    adiciona(pet, res){

        uploadDeArquivos(pet.imagem, pet.nome, (erro, novoCaminho) =>{
            // Se tivermos um erro com o arquivo que nos foi enviado não inserimos em nossa Querry o arquivo enviado
            // retornamos um erro 400.
            if (erro)
            {
                res.status(400).json({erro})
            }
            // Caso não tenha nada de errado com arquivo que recebemos, adicionamos o arquivo e info na nossa Querry
            // retornamos um suceesso 200
            else
            {
                const query = 'INSERT INTO Pets SET ?'
                const novoPet = {nome: pet.nome, imagem: novoCaminho}
                conexao.query(query, novoPet, erro => {
            
                    if(erro){
                        res.status(400).json(erro)
                    }
                    else{
                        res.status(200).json(novoPet)
                    }
        
                })
            }

            
        })
        
        
    }
}
module.exports = new Pet()