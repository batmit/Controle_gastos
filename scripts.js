const Modal = {

    open(){

        // abrir modal
        // adicionar active ao modal

        //alert("Abri o Modal")

        document.querySelector('.modal-overlay').classList.add('active')

    },
    close(){
        //fechar modal
        // remover class active do modal

        document.querySelector('.modal-overlay').classList.remove('active')


    }
} 

const Storage = {
    get() {

        return JSON.parse(localStorage.getItem('dev.finnances:transaction'))  || []  //transforma em array

    },

    set(transactions) {

        localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions)) //os dois valores representam o objeto e seu valor. transforma em string

    }
}


const Transaction = {

    all: Storage.get(),

    add(transaction){

        Transaction.all.push(transaction)
        

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1) //remove

        App.reload()
    },

    incomes() {
        //somar as entradas
        //se for maior que zero somar 

        let income = 0;

        Transaction.all.forEach(function(transaction) {
            if(transaction.amount > 0 ){
                income = income + transaction.amount;    //repetição vai somando 

            }
        })

        return income;

    },
    expenses() {
        //somar as saídas

        let expense = 0;

        Transaction.all.forEach(function(transaction) {
            if(transaction.amount < 0 ){
                expense = expense + transaction.amount;    //repetição vai somando 

            }
        })

        return expense;
    },

    total() {
        //as entradas menos as saídas

        return Transaction.incomes() + Transaction.expenses();

    }
}

//Pegar as transações 
//objeto no js
//colocar no html

const DOM = {

    transactionsContainer: document.querySelector("#data-table tbody"),

    addTransaction(transaction, index) {
        //console.log('cheguei aqui') mostra no console
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) //o transaction é o transaction[0]

        tr.dataset.index = index

        //console.log(tr.innerHTML)

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) { //recebe o transactions[0]

        const CSSclass = transaction.amount> 0 ? "income" : "expense" //se for maior que zero income, se for menos, expense

        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
       
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="Transaction.remove(${index})" src="./minus.svg" alt="remover transação"></td>    
        
        `
        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes()) //esse innerHTML troca o que tem para o que está recebendo
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses()) //esse innerHTML troca o que tem para o que está recebendo
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total()) //esse innerHTML troca o que tem para o que está recebendo
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils = {

    formatAmount(value) {

        value = Number(value) * 100

        //console.log(Number(value))  // transforma a string em value

        return value
    },

    formatDate(date) {


        const splittedDate = date.split("-")   // o split destaca as posições do array entre aspas e elimina elas

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`  // mostra a data toda arrumada na poisção que e quero

    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")//transforma o número em uma string, o replace converte o value em número puro

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style:"currency",
            currency: "BRL",  //converte para o formato do Real

        })

        //console.log(amount)

        return signal+ value

    }
}

//DOM.addTransaction(transactions[0])   passa o transactions[0] para o transactions

//for(let i = 0; i < 3; i++){
//    console.log(i)
//}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields() { //validar os campos

        const {description, amount, date} = Form.getValues() // consegue pegar todos os dados dessa forma

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {    //o trim limpa os espaços vazios. Verifica se um está vazio. o || significa ou

            throw new Error("Por favor, preencha todos os campos")

        }
    },

    formatValues() {

        let {description, amount, date} = Form.getValues() // consegue pegar todos os dados dessa forma. o let permite a formatação


        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
 
        return{
            description: description,
            amount: amount,
            date: date,
        }

    },

    clearFields() {

        Form.description.value = ""   // limpa tudo
        Form.amount.value = ""        // limpa tudo
        Form.date.value = ""          // limpa tudo

    },

    submit(event) {

        //console.log(event)

        event.preventDefault()  // faz com  que não manda para a URL os dados

        try {

            Form.validateFields()

            const transaction = Form.formatValues()

            Transaction.add(transaction)

            Form.clearFields()

            Modal.close()
            
        } catch (error) {

            alert(error.message)
            
        }

     


    }
}


const App = {
    init() {

        Transaction.all.forEach((transaction, index) => {         //melhor jeito de repetição
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()

        Storage.set(Transaction.all)


    },
    reload() {

        DOM.clearTransactions() // vai usar a função que eu criei lá me cima para apagar tudo que tinha processado.
        App.init()
    }   
}

App.init()


