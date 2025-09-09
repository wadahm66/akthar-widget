import React from 'react';

const StockDisplay = () => {
  // Dummy stock data
  const stockData = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.45,
    variation: 2.34,
    variationPercent: 1.25,
  };

  const isPositive = stockData.variation >= 0;

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto border border-gray-200'>
      <div className='flex items-start justify-between mb-4'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            {stockData.symbol}
          </h2>
          <p className='text-sm text-gray-600'>{stockData.name}</p>
        </div>
        <div className='text-right'>
          <p className='text-2xl font-semibold text-gray-900'>
            ${stockData.price.toFixed(2)}
          </p>
          <div
            className={`flex items-center text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <span className='mr-1'>{isPositive ? '▲' : '▼'}</span>
            <span>
              {isPositive ? '+' : ''}${stockData.variation.toFixed(2)}(
              {isPositive ? '+' : ''}
              {stockData.variationPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className='pt-4 border-t border-gray-100'>
        <p className='text-xs text-gray-500'>
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default StockDisplay;
