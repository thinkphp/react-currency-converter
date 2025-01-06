import React, { useState, useEffect } from 'react';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency && amount > 0) {
      convertCurrency();
    }
  }, [fromCurrency, toCurrency, amount]);

  const fetchCurrencies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setCurrencies(Object.keys(data.rates));
      setError(null);
    } catch (err) {
      setError('Failed to fetch currencies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const convertCurrency = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      const rate = data.rates[toCurrency];
      setConvertedAmount((amount * rate).toFixed(2));
      setError(null);
    } catch (err) {
      setError('Failed to convert currency. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="converter-card">
      <h1 className="converter-title">Currency Converter</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="converter-content">
        <div className="input-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>

        <div className="currency-selects">
          <div className="input-group">
            <label>From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              disabled={isLoading}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              disabled={isLoading}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="result">
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            convertedAmount && (
              <div className="converted-amount">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
