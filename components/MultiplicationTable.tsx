import React, { useEffect, useState } from 'react';

const MultiplicationTable: React.FC = () => {
  const [multiplicationNumbersRange, setMultiplicationNumbersRange] = useState(
    new Array(11).fill('').map((a, i) => i)
  );
  const [multiplicationMin, setMultiplicationMin] = useState(0);
  const [multiplicationMax, setMultiplicationMax] = useState(10);

  const onlyNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '' && !/^[0-9\b]+$/.test(event.target.value)) {
      event.target.classList.remove('input-incorrect');
      event.target.classList.add('input');

      event.target.value = event.target.value.replace(/[a-zA-Z;:\/\?]/gm, '');
      return false;
    }

    return true;
  };

  const focusNextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (!input) return;

    const allInputs = document.querySelectorAll('input[data-multiplication]');

    const currentIndex = Array.from(allInputs).indexOf(input);

    if (currentIndex === allInputs.length - 1) return;

    const nextInput = allInputs[currentIndex + 1] as HTMLInputElement;

    nextInput.focus();
  };

  const setMultiRange = () => {
    if (
      multiplicationMin >= multiplicationMax ||
      isNaN(multiplicationMin) ||
      isNaN(multiplicationMax)
    )
      return;

    const range: number[] = [];

    for (
      let index = multiplicationMin;
      index < multiplicationMax + 1;
      index++
    ) {
      range.push(index);
    }

    setMultiplicationNumbersRange(range);
  };

  const setMultiMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onlyNumber(event)) {
      return;
    }

    const input = parseInt(event.target.value);

    if (input < 0) return;

    setMultiplicationMin(input);
  };

  const setMultiMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onlyNumber(event)) {
      return;
    }

    const input = parseInt(event.target.value);

    if (input < 0) return;

    setMultiplicationMax(input);
  };

  useEffect(setMultiRange, [multiplicationMin, multiplicationMax]);

  const validateMultiplicationInput = (
    value: number,
    column: number,
    row: number
  ) => {
    return value === column * row;
  };

  const handleMultiplicationInput =
    (column: number, row: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!onlyNumber(event)) {
        return;
      }

      const input = parseInt(event.target.value);

      if (!validateMultiplicationInput(input, column, row)) {
        event.target.classList.add('animate-incorrect');
        event.target.classList.remove('input-correct');
        event.target.classList.add('input-incorrect');
        setTimeout(() => event.target.classList.remove('animate-incorrect'), 500);
        return;
      }

      event.target.classList.add('animate-correct');
      event.target.classList.remove('input-incorrect');
      event.target.classList.add('input-correct');
      setTimeout(() => event.target.classList.remove('animate-correct'), 600);
      focusNextInput(event);
    };

  return (
    <section className="px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="card p-6 sm:p-8 mb-8 animate-scale-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📊 Multiplication Table
          </h2>
          
          <div className="print-hide">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <span className="text-lg font-medium text-gray-700">Practice Range:</span>
              <div className="flex items-center gap-3">
                <input
                  className="input w-20 text-center"
                  value={multiplicationMin}
                  onChange={setMultiMin}
                  placeholder="0"
                  type="text"
                  pattern="[0-9]*"
                />
                <span className="text-gray-500 font-medium">to</span>
                <input
                  className="input w-20 text-center"
                  value={multiplicationMax}
                  onChange={setMultiMax}
                  placeholder="10"
                  type="text"
                  pattern="[0-9]*"
                />
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600 mb-4">
              💡 Fill in the multiplication table below. Correct answers will turn green!
            </div>
          </div>
        </div>

        {/* Multiplication Table */}
        <div className="card p-4 sm:p-6 animate-scale-in overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Table Container */}
              <div className="flex">
                {/* Y-axis (left column) */}
                <div className="flex flex-col">
                  {multiplicationNumbersRange.map((parentItem, index) => (
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold border-2 transition-all duration-300 ${
                        index === 0 
                          ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 text-purple-700' 
                          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                      }`}
                      key={`y-axis-${parentItem}`}
                    >
                      {index === 0 ? '×' : index}
                    </div>
                  ))}
                </div>

                {/* Main table area */}
                <div className="flex-1">
                  {/* X-axis (top row) */}
                  <div className="flex">
                    {multiplicationNumbersRange.slice(1).map((parentItem, index) => (
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700 hover:bg-blue-100 transition-all duration-300"
                        key={`x-axis-${parentItem}`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  {/* Input grid */}
                  {multiplicationNumbersRange.slice(1).map((parentIndex) => (
                    <div key={`row-${parentIndex}`} className="flex">
                      {multiplicationNumbersRange.slice(1).map((childIndex, index) => (
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white"
                          key={`input-${parentIndex}-${childIndex}`}
                        >
                          <input
                            className="w-full h-full text-center text-xs sm:text-sm md:text-base font-medium border-none bg-transparent focus:bg-blue-50 transition-all duration-300 hover:bg-gray-50"
                            onChange={handleMultiplicationInput(
                              parentIndex,
                              childIndex
                            )}
                            data-multiplication="true"
                            pattern="[0-9]*"
                            placeholder=""
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-6 print-hide">
            <div className="text-center text-sm text-gray-600 mb-2">
              Keep going! Each correct answer brings you closer to mastery 🌟
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(document.querySelectorAll('.input-correct').length / 
                    (multiplicationNumbersRange.length - 1) ** 2) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="card p-6 mt-8 animate-fade-in print-hide">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">💡 Multiplication Tips</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p>• Start with the easier ones (2×, 5×, 10×)</p>
              <p>• Use patterns: 9× numbers always add up to 9</p>
              <p>• Remember: 6×7 = 42, 6×8 = 48</p>
            </div>
            <div className="space-y-2">
              <p>• Practice a little bit every day</p>
              <p>• Use your fingers for 9× tables</p>
              <p>• Double-check your work</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiplicationTable;