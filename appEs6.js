
{
    class BudgetController
    {
        constructor(id = null, description, value)
        {
            this.id = id;
            this.description = description;
            this.value = value;
            this.allItems = {
                exp: [],
                inc: []
            };
            this.totals = {
                exp: 0,
                inc: 0
            };
            this.budget = 0;
            this.percentage = -1;
            this.show = () => {console.log(`${this.totals.exp} // ${this.totals.inc}`);}
            this.display = () => { console.log(`${id},${description},${value}`); };
            
        }
        
        calcTotal(type)
        {
            let sum = 0;

            this.allItems[type].forEach(x => {
                sum += x.value;
            });

            this.totals[type] = sum;
        }

        calcBudget()
        {
            this.calcTotal('exp');
            this.calcTotal('inc');

            this.budget = this.totals.inc - this.totals.exp;

            if (this.totals.inc > 0)
            {
                this.percentage = Math.round((this.totals.exp / this.totals.inc) * 100);    
            }
            else
            {
                this.percentage = -1;    
            }
        }
        addItem(el)
        {
            let ID, newItem;
            if (this.allItems[el.type].length > 0)
            {
                ID = this.allItems[el.type][this.allItems[el.type].length - 1].id + 1;    
            }
            else
            {
                ID = 0;
            }
            if (el.type == 'exp')
            {
                newItem = new Expenses(el.description, el.value,ID);
            }
            else (el.type == 'inc')
            {
                newItem = new Income(el.description, el.value,ID);
            }
            
            this.allItems[el.type].push(newItem);

            
        }
        
        deleteItem()
        {

        }

        print()
        {
            this.show();
            
        }
        
        get budgetCtrl()
        {
            return {
                budget: this.budget,
                totalInc: this.totals.inc,
                totalExp: this.totals.exp,
                percentage: this.percentage,
                all: this.allItems
            }
        }
    };

    class Expenses extends BudgetController
    {
        constructor(description, value,id = null,percentage,type = 'exp')
        {
            super(id, description, value);
            this.display = () => { console.log(`${id},${description},${value}`); };
            this.percentage = -1;
            this.type = type;
        }
    }

    class Income extends BudgetController
    {
        constructor(description, value,id = null,type = 'inc')
        {
            super(id, description, value);
            this.display = () => { console.log(`${id},${description},${value}`); };
            this.type = type;
        } 
    }



/*
    const control = new BudgetController();

    const costo_01 = new Expenses('Gas', 440);
    const costo_02 = new Income('Sueldo', 5440);
    const costo_03 = new Income('VHS', 740);

    control.addItem(costo_01);
    control.addItem(costo_02);
    control.addItem(costo_03);

    control.calcBudget();
    control.print();
    console.log(control.budgetCtrl.all);
*/
    class UIController
    {
        constructor()
        {
            
        }

        get input()
        {
            return {
                type: document.querySelector(this.inputType).value,
                description: document.querySelector(this.inputDescription).value, //DESCRIPCION
                value: parseFloat(document.querySelector(this.inputValue).value),
            }
        }
        set output()
        {

        }
    }

/*

 */
}


/*
class Gato {
    constructor(nombre,edad = null) {
        this.nombre = nombre;
        this.edad = edad;
    }
    


    hablar() {
      console.log(this.nombre + ' hace ruido.');
    }
  }
  
  class Leon extends Gato {
    hablar() {
      //super.hablar();
      console.log(this.nombre + ' maulla.');
    }
}
  
const newFeline = new Gato('Baku',2);
const newFeline2 = new Gato('Jotaro',4);
newFeline2.data(el => allfelines.push(newFeline));

newFeline2.data(el =>allfelines.push(newFeline2));

console.log(newFeline.data());*/