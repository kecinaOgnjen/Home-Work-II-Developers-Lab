import React, { Component } from "react";
import axios from "axios";

import './converter.css';

class Converter extends Component {
    state = {
        result: null,
        fromCurrency: "EUR",
        toCurrency: "RSD",
        amount: 1,
        currencies: [],
    };

    componentDidMount() {
        axios
            .get("http://data.fixer.io/api/latest?access_key=77de4343754c4aad423c5480672e71cf")
            .then(response => {
                const currency = []
                for (const key in response.data.rates) {
                    if (key === "EUR" || key === "USD" || key === "RSD" || key === "GBP") {
                        currency.push(key)
                    } else {
                        continue;
                    }
                }
                this.setState({ currencies: currency.sort() })
            })
            .catch(err => {
                console.log(err);
            });
    }

    convertHandler = () => {
        if (this.state.fromCurrency !== this.state.toCurrency) {
            axios
                .get(`http://data.fixer.io/api/latest?access_key=77de4343754c4aad423c5480672e71cf&base=${this.state.fromCurrency}&symbols=${this.state.toCurrency}`)
                .then(response => {
                    const result = this.state.amount * (response.data.rates[this.state.toCurrency]);
                    this.setState({ result: result.toFixed(3) })
                    console.log(response.data);
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            this.setState({ result: "Choose two different currencies to convert!" })
        }
    };

    selectHandler = (event) => {
        if (event.target.name === "from") {
            this.setState({ fromCurrency: event.target.value })
        }
        if (event.target.name === "to") {
            this.setState({ toCurrency: event.target.value })
        }
    }

    render() {
        return ( 
            <div className = "converter">
            <div className = "form">
            <input name = "amount" type = "number" min = "0"
            value = { this.state.amount }
            onChange = {
                event =>
                this.setState({ amount: event.target.value })
            }
            /> 
            <select name = "from"
            onChange = {
                (event) => this.selectHandler(event)
            }
            value = { this.state.fromCurrency } > {
                this.state.currencies.map(cur => ( 
                    <option key = { cur } > { cur } </option>
                ))
            } 
            </select> 
            <select name = "to"
            onChange = {
                (event) => this.selectHandler(event)
            }
            value = { this.state.toCurrency } > {
                this.state.currencies.map(cur => ( 
                    <option key = { cur } > { cur } </option>
                ))
            } 
            </select> 
            <button onClick = { this.convertHandler } > Convert </button> 
            </div> 
            {
                this.state.result &&
                <h3> { this.state.result } </h3>
            } 
            </div>
        );
    }
}

export default Converter;