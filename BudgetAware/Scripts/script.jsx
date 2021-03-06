﻿class RecentPurchases extends React.Component {
    constructor(props) {
        super(props)
        this.parseJsonDate = this.parseJsonDate.bind(this);
        this.state = {
            minList: true
        }
    }

    parseJsonDate(jsonDate) {
        var date = new Date(parseInt(jsonDate.replace('/Date(', '')));
        date = date.getMonth() + '/' + date.getDate();
        return date;
    }

    toggle() {
        this.setState({
            minList: !this.state.minList
        })
    }


    render() {
        return (
            <div>
                <div className='card-header'>
                    Recent Purchases
                    </div>
                <div className={this.state.minList ? 'minifiedList card-body' : 'expendedList card-body'}>

                    <div className='card-text'>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.purchases.map(i => <tr><td>{i.Company}</td><td>{i.Cost}</td><td>{this.parseJsonDate(i.PurchaseDate)}</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        )

    }
}

class PurchaseSummary extends React.Component {
    constructor(props) {
        super(props);
        this.deserialize = this.deserialize.bind(this);
        this.categorizePurchases = this.categorizePurchases.bind(this);
        this.child = React.createRef();
    }

    onClick = () => {
        this.child.current.toggle();
    };

    categorizePurchases(value) {

        let deserializedObject = this.deserialize(value);

        let clothesArray = [];
        let foodArray = [];
        let miscArray = [];
        let entertainmentArray = [];
        let rentArray = [];
        let autoArray = [];

        let clothesCost = 0;
        let foodCost = 0;
        let miscCost = 0;
        let entertainmentCost = 0;
        let autoCost = 0;
        let rentCost = 0;

        deserializedObject.map(i => i.Categories.Name == 'Clothing' ? clothesArray.push(i.Cost) : clothesArray.push(0));
        deserializedObject.map(i => i.Categories.Name == 'Food' ? foodArray.push(i.Cost) : foodArray.push(0));
        deserializedObject.map(i => i.Categories.Name == 'Misc' ? miscArray.push(i.Cost) : miscArray.push(0));
        deserializedObject.map(i => i.Categories.Name == 'Entertainment' ? entertainmentArray.push(i.Cost) : entertainmentArray.push(0));
        deserializedObject.map(i => i.Categories.Name == 'Auto' ? autoArray.push(i.Cost) : autoArray.push(0));
        deserializedObject.map(i => i.Categories.Name == 'Rent' ? rentArray.push(i.Cost) : rentArray.push(0));

        clothesArray.map(i => clothesCost = clothesCost + i);
        foodArray.map(i => foodCost = foodCost + i);
        miscArray.map(i => miscCost = miscCost + i);
        entertainmentArray.map(i => entertainmentCost = entertainmentCost + i);
        autoArray.map(i => autoCost = autoCost + i);
        rentArray.map(i => rentCost = rentCost + i);


        let costArray = [clothesCost, foodCost, miscCost, entertainmentCost, autoCost, rentCost];
        return costArray;
    }

    deserialize(text) {
        let value = JSON.parse(text.innerText);
        return value;
    }

    render() {
        let purchaseText = document.getElementById('ContentPlaceHolder1_hiddenJsonPurchases');

        let budgetText = document.getElementById('ContentPlaceHolder1_hiddenJsonBudget');

        return <div onClick={this.onClick}><RecentPurchases ref={this.child} purchases={this.deserialize(purchaseText)} /> <PieChart data={this.categorizePurchases(purchaseText)} /><BudgetDiagram purchases={this.categorizePurchases(purchaseText)} budget={this.deserialize(budgetText)} /> </div>
    }


}
class BudgetDiagram extends React.Component {
    constructor(props) {
        super(props);
        this.renderBudgetChart = this.renderBudgetChart.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        google.charts.load('current', { 'packages': ['bar'] });
        google.charts.setOnLoadCallback(this.renderBudgetChart());
    }

    renderBudgetChart() {
        let clothesBudget = this.props.budget.find(i => i.Categories.Name == 'Clothing');
        let foodBudget = this.props.budget.find(i => i.Categories.Name == 'Food');
        let entertainmentBudget = this.props.budget.find(i => i.Categories.Name == 'Entertainment');
        let miscBudget = this.props.budget.find(i => i.Categories.Name == 'Miscellaneous');
        let autoBudget = this.props.budget.find(i => i.Categories.Name == 'Auto');
        let rentBudget = this.props.budget.find(i => i.Categories.Name == 'Rent');


        clothesBudget = clothesBudget == undefined ? 0 : clothesBudget.Amount;
        foodBudget = foodBudget == undefined ? 0 : foodBudget.Amount;
        entertainmentBudget = entertainmentBudget == undefined ? 0 : entertainmentBudget.Amount;
        miscBudget = miscBudget = miscBudget == undefined ? 0 : miscBudget.Amount;
        autoBudget = autoBudget == undefined ? 0 : autoBudget.Amount;
        rentBudget = rentBudget == undefined ? 0 : rentBudget.Amount;

        var data = new google.visualization.arrayToDataTable([
            ['Category', 'Budget', 'Spent'],
            ['Clothing', clothesBudget, this.props.purchases[0]],
            ['Food', foodBudget, this.props.purchases[1]],
            ['Entertainment', entertainmentBudget, this.props.purchases[2]],
            ['Miscellaneous', miscBudget, this.props.purchases[3]],
            ['Auto', autoBudget, this.props.purchases[4]],
            ['Rent', rentBudget, this.props.purchases[5]]
        ]);

        var options = {
            width: '100%',
            bars: 'vertical',
            colors: ['#34495e', '#ecf0f1']
        }

        var chart = new google.charts.Bar(document.getElementById('bar'));

        chart.draw(data, options);
    }

    render() {
        return '';
    }
}

class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        // Load the Visualization API and the corechart package.
        google.charts.load('current', { 'packages': ['corechart'] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(this.drawChart);
    }

    drawChart() {
        // Create the data table.
        var data = new google.visualization.DataTable();

        data.addColumn('string', 'Category');
        data.addColumn('number', 'Cost');
        data.addRows([
            ['Clothing', this.props.data[0]],
            ['Food', this.props.data[1]],
            ['Entertainment', this.props.data[2]],
            ['Miscellanous', this.props.data[3]],
            ['Auto', this.props.data[4]],
            ['Rent', this.props.data[5]],
        ]);

        // Set chart options
        var options = {
            'width': '100%',
            'height': 300,
            'colors': ['#34495e', '#2c3e50', '#95a5a6', '#7f8c8d', '#bdc3c7', '#ecf0f1', '#f6f6f6'],
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('pie'));
        chart.draw(data, options);
    }

    render() {
        return '';
    }
}

ReactDOM.render(<PurchaseSummary />, document.getElementById('app2'))
