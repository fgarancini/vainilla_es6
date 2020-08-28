/* MODULE DATA ENCAPSULATION */


// BUDGET CONTROLLER
var budgetController = (function () {
    var Expense = function (id, description, value) { // constructor de gastos
        this.id = id;
        this.description = description;
        this.value = value;        
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome)
    {
        if(totalIncome > 0)
        {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else
        {
            this.percentag = -1;
        }
    };

    Expense.prototype.getPercentage =  function()
    {
        return this.percentage;
    };

    var Income = function (id, description, value) { // constructor de ingresos
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type)//CALCULA EL TOTAL 
    {
        var sum = 0;
        /*
            El objeto data contiene los items de gastos e ingresos
            ->forEach<- itera el array aceptando una IFEE
            haciendo la suma de los input segun el tipo
        */
        data.allItems[type].forEach(function(curr)
        {
            sum += curr.value;
        });
        data.totals[type] = sum;
    };

    var data =
    {
        allItems: // todos los valores de ingreso y gasto por separado
        {
            exp: [],
            inc: []
        },
        totals: // totales por separado
        {
            exp: 0,
            inc: 0
        },
        budget : 0, // total disponible
        percentage: -1 // porcentaje gastado del total
    };

    return { //PROPIEDADES
        addItem: function (type, des, val) {
            var newItem, ID;
            //create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }
            //CREAR EL OBJETO SEGUN SU TIPO
            if (type == 'exp') {
                newItem = new Expense(ID, des, val);
            }
            else if (type == 'inc') {
                newItem = new Income(ID, des, val);
            }
            //PUSH TO DE DATA STRUCTURE
            data.allItems[type].push(newItem);
            //RETORNA EL ELEMENTO
            return newItem;
        },

        deleteItem: function(type, id)
        {
            var ids,index;
            // id = 3
            ids = data.allItems[type].map(function(current) // retorna un array con los datos del objeto pasado como parametro
            {
                return current.id;
            });

            index = ids.indexOf(id);//devuelve la pos del array

            if(index !== -1)
            {
                data.allItems[type].splice(index, 1); // Esto remueve elementos del objeto segun su poscicion *1* objeto
            }
        },

        calculateBudget : function()//CALCULADOR DE PRESUPUESTO Y PORCENTAJE
        {
            // calculate otal income and expenses
            calculateTotal('exp');//SEGUN EL TIPO HACE LAS SUMAS
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the porcent of income that we spent
            if(data.totals.inc > 0)
            {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else
            {
                data.percentage = -1;
            }

        },

        getBudget: function()// GETTER DEL BUDGET
        {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        calculatePercentage: function()
        {
            data.allItems.exp.forEach(function(curr)
            {
                curr.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function()
        {
            var allPerc= data.allItems.exp.map(function(curr)
            {
                return curr.getPercentage();
            });
            return allPerc;
        },

        testing: function () {
            console.log(data);
        }
    };
})();

// USER INTERFACE CONTROLLER
var UIController = (function () {
    var DOMstrings = { // objeto del dom retorna la claseHTML del input/output
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        porcentageLabel: '.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    var formatNumber = function(num,type)
    {
        var num,numSplit,int,dec, type;
        /*
         + or - before number
         exactly 2 decimals
         comma separating the thousands

         2310.4267 -> + 2,310.45
         2000 -> +2,000.00
        */
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
           int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback)
    {
        for(var i = 0;i < list.length;i++)
        {
            callback(list[i], i);
        }
    };

    return { //PROPIEDADES/METODOS DEL OBJETO
        getInput: function () { // GET DEL INPUT
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value, //DESCRIPCION
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),// VALOR
            };

        },

        addListItem: function (obj, type) {
            // agrega el objeto a la lista HTML
            var html, newHtml, element;
            // create html string con peaceholder text
            if (type == 'inc')//segun el tipo del objeto
            {
                element = DOMstrings.incomeContainer;//desde su clase html
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }

            //replace the placeholder text with some actual data//remplaza en el string del html por las propiedades del objeto principal
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
            //insert the HTML into de DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); // propieda de JSON ubica el texto/hijo en el lugar especifico del div seleccionado
        },
        
        deleteListItem: function(selectedID)
        {
            var el = document.getElementById(selectedID);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields); //PROTO DEL ARRAY COSNTRUCTOR PARA CAMBIAR EL TIPO DE DATO DE LISTA A ARRAY RETORNA UN ARRAY

            fieldsArr.forEach(function (current, index, arr) {
                current.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj)
        {
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0)
            {
                document.querySelector(DOMstrings.porcentageLabel).textContent = obj.percentage + '%';
            }
            else
            {
                document.querySelector(DOMstrings.porcentageLabel).textContent = '---';
            }
            
        },

        displayPercentages: function(percentages)
        {
            var fields;
            fields = document.querySelectorAll(DOMstrings.expensesPercLabel);//Esto retorna una lista de nodos

           
            nodeListForEach(fields, function(current, index)
            {
                if(percentages[index] > 0)
                {
                    current.textContent = percentages[index] + '%';
                }
                else
                {
                    current.textContent = '---';
                }
            });
            // algorithm
        },

        displayMonth: function()
        {
            var now, year, month,months;
            now = new Date();
            months = ['Enero','Febrero','Marzo','Abril','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] +' '+year;
        },

        changedType: function()
        {
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            nodeListForEach(fields, function(curr)
            {
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMstrings: function () { // DOM CON LA CLASE
            return DOMstrings;
        }
    };
})();


// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListener = function () // EVENTO DEL BOTON CON CLICK Y ENTER
    {
        var DOM = UICtrl.getDOMstrings(); // LLAMADO A LAS CLASES DEL DOM

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem),

        document.addEventListener('keypress', function (event) // FUNCION 'keypress'
        {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function()
    {
        //1.CALCULATE THE BUDGET
        budgetCtrl.calculateBudget();
        //2. RETURN THE BUDGET
        var budget = budgetCtrl.getBudget();
        //3. DISPLAY THE BUDGET ON THE IU
        UICtrl.displayBudget(budget);

    }

    var updatePercentages = function()
    {
        var percentages;
        //1.calculate the budget
        budgetCtrl.calculatePercentage();
        //2.Read percentages from the budget controller
        percentages = budgetCtrl.getPercentages();
        //3.Update UI
        UICtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = function () 
    {
        /*
            EL INPUT TIENE COMO PROPIEDAD DE OBJETO LOS DATOS DE TYPE DESCRIPTION
            Y VALUE QUE CONFORMAN AL NEW ITEM, CON EL TYPE ES DISCRIMINADO EN EL 
            ADD LIST ITEM
        */
        var input, newItem;
        //1. GET THE FIELD INPUT DATA
        input = UICtrl.getInput(); // LLAMADA AL CONTROLADOR DEL UI
        if(input.description !== "" && !isNaN(input.value) && input.value > 0)
        {
            //2. ADD DE ITEM TO THE BUGGET CONTROLLER
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. ADD THE ITEM TO DE IU
            UICtrl.addListItem(newItem, input.type);
            //4.Clear the fields
            UICtrl.clearFields();
            //5. CALC AND UPDATE
            updateBudget();
            //6. UPDATE %
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) 
    {
        var itemID,splitID,type,ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;// mustra el lugar con el child seleccionado

        if(itemID)
        {
            splitID = itemID.split('-'); //slpit devuelve un array
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1.Delete the item from the data structure
            budgetCtrl.deleteItem(type,ID);
            //2.Delete the item prom the UI
            UICtrl.deleteListItem(itemID);
            //3.Update and show de new budget
            updateBudget();
            //6. UPDATE %
            updatePercentages();

        }
    };

    return { //PROPIEDADES DEL OBJETO
        init: function () { // INICIALIZADOR DEL CONTROLLER
            console.log('Aplication has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListener();
            
        }
    };
})(budgetController, UIController);

controller.init();