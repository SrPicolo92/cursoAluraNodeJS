/*Responsabilidade do repositorios:
- Todos os códigos relacionados ao nosso CRUDE, buscar informações
- Essa é a nossa camada de dados, responsável por lidar cons os dados da aplicação, aqui não precisamos nos preocupar da onde esses dados vem.
*/
const query = require('../infraestrutura/database/queries')

class Atendimento {
    adiciona(atendimento) {
    const sql = 'INSERT INTO Atendimentos SET ?'
    return query(sql, atendimento)
    }

    lista() {
        const sql = 'SELECT * FROM Atendimentos'
        return query(sql)
    }
    
}

module.exports = new Atendimento()