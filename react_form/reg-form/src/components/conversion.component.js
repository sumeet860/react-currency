import React, { useEffect, useState } from 'react';
// import './App.css';
import CurrencyRow from './CurrencyRow.component'

const BASE_URL = 'https://api.exchangeratesapi.io/latest'

export function CurrencyConversion() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [twoCurrency, setTwoCurrency] = useState()
  const [threeCurrency, setThreeCurrency] = useState()
  const [fourthCurrency, setFourthCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        const secondCurrency = Object.keys(data.rates)[1]
        const thirdCurrency = Object.keys(data.rates)[2]
        setCurrencyOptions([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setTwoCurrency(firstCurrency)
        setThreeCurrency(secondCurrency)
        setFourthCurrency(thirdCurrency)
        setExchangeRate(data.rates[firstCurrency])
        setExchangeRate(data.rates[secondCurrency])
        setExchangeRate(data.rates[thirdCurrency])

      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && twoCurrency != null && threeCurrency != null && fourthCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${twoCurrency}&symbols=${threeCurrency}&symbols=${fourthCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[twoCurrency]))
        .then(data => setExchangeRate(data.rates[threeCurrency]))
        .then(data => setExchangeRate(data.rates[fourthCurrency]))

    }
  }, [fromCurrency, twoCurrency, threeCurrency, fourthCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>

      <div className="converter">
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={twoCurrency}
        onChangeCurrency={e => setTwoCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={threeCurrency}
        onChangeCurrency={e => setThreeCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fourthCurrency}
        onChangeCurrency={e => setFourthCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </div>
    </>
  );
}

export default CurrencyConversion;
