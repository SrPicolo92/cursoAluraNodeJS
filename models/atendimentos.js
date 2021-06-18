/* Principais Responsabilidades dos Models
- Model é a nossa camada de Regra de Negócios, aqui que se faz validações referentes as regras de negócios
- Tratamento de Erros
- Salvando informações na Base de Dados
*/
const axios = require('axios')
const moment = require('moment')
const conexao = require('../infraestrutura/database/conexao')
const repositorio = require('../repositorios/atendimentos')


class Atendimento{
    constructor() {
        //Fazendo algumas validações do request pelo cliente
        this.isDataValida = (dataAgendamento, dataCriacao) => moment(dataAgendamento, 'DD/MM/YYYY').isSameOrAfter(dataCriacao)
        this.isClienteValido = (tamanho) => tamanho >= 2
        
        this.valida = parametros => this.validacoes.filter(campo => {
            const {nome} = campo
            const parametro = parametros[nome]

            return !campo.valido(parametro)
        })
        //Agrupando as validações
        this.validacoes = [
            {
                nome: 'data',
                valido: this.isDataValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: this.isClienteValido,
                mensagem: 'Cliente deve ter mais que 2 caracteres'
            }
        ]
    }



    adiciona(atendimento)
    {
        //Formantando as datas, Criacao => no momento do request, Agendamento => data agendada
        const dataCriacao = moment().format('YYYY-MM-DD hh:mm:ss')
        const dataAgendamento = moment(atendimento.dataAgendamento, 'DD/MM/YYYY').format('YYYY-MM-DD hh:mm:ss')
        const parametros = {
            data: {dataAgendamento, dataCriacao},
            cliente: {tamanho: atendimento.cliente.length}
        }


        //Se algum dos campos 'valido' for false teremos algo na array
        const erros = this.valida(parametros)

        
        //Se não tiver nada na array erros, o length será 0, o que é false.
        const isThereErros = erros.length

        //Se tem erro portanto retorna erro 400 e a array de erros, porém se não tiver erros teremos o procedimento normal
        if(isThereErros)
        {
            return new Promise((resolve, reject) => reject(erros))
            
        }
        else
        {
            const atendimentoComData = {...atendimento, dataCriacao, dataAgendamento}
            
            return repositorio.adiciona(atendimentoComData)
                .then(resultados => {
                    const id = resultados.insertId
                    return { ...atendimento, id }
                })
        }
        
    }

    lista()
    {
        return repositorio.lista()
    }

    buscaPorId(id,res){
        const sql = 'SELECT * FROM Atendimentos WHERE id=' + id
        const cpf = atendimento.cliente
        conexao.query(sql, async (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro)
            {
                res.status(400).json(erro)
            }
            else
            {
                const { data } = await axios.get('http://localhost:8082/' + cpf)
                atendimento.cliente = data
                res.status(200).json(atendimento)
            }
        })
    }

    altera(id, valores, res) {
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }      
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({...valores, id})
            }
        })
    }

    deleta(id, res) {
        const sql = 'DELETE FROM Atendimentos WHERE id=?'

        conexao.query(sql, id, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({id})
            }
        })
    }

}



module.exports = new Atendimento