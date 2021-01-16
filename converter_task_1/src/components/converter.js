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
            .get("https://free.currconv.com/api/v7/currencies?apiKey=d5937665045783289b6d")
            .then(response => {
                const currency = []
                for (const key in response.data.results) {
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
                .get(`https://free.currconv.com/api/v7/convert?apiKey=d5937665045783289b6d&q=${this.state.fromCurrency}_${this.state.toCurrency}`)
                .then(response => {
                    const result = `${this.state.fromCurrency}_${this.state.toCurrency}`;
                    this.setState({ result: response.data.results[result].val.toFixed(3) })
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
                <h4> { this.state.result } </h4>
            } 
            </div>
        );
    }
}

export default Converter;