import React, { useEffect, useState } from 'react';

const MultiplicationTable: React.FC = () => {
  const [multiplicationNumbersRange, setMultiplicationNumbersRange] = useState(
    new Array(11).fill('').map((a, i) => i)
  );
  const [multiplicationMin, setMultiplicationMin] = useState(0);
  const [multiplicationMax, setMultiplicationMax] = useState(10);

  const onlyNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '' && !/^[0-9\b]+$/.test(event.target.value)) {
      event.target.style.backgroundColor = 'white';

      event.target.value = event.target.value.replace(/[a-zA-Z;:\/\?]/gm, '');
      return false;
    }

    return true;
  };

  const focusNextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (!input) return;

    const allInputs = document.querySelectorAll('input');

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
        event.target.style.backgroundColor = 'red';

        return;
      }

      event.target.style.backgroundColor = 'green';
      focusNextInput(event);
    };

  return (
    <section className="">
      <h2 className="text-center font-bold text-2xl ">
        Multiplication table
      </h2>
      <p className="print-hide text-center p-4 flex gap-4 items-center justify-center">
        <span>Enter Range</span>
        <input
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
          value={multiplicationMin}
          onChange={setMultiMin}
          placeholder="0"
          type="text"
          size={4}
          pattern="[0-9]*"
        />
        <span>-</span>
        <input
          className=" p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
          value={multiplicationMax}
          onChange={setMultiMax}
          placeholder="0"
          type="text"
          size={4}
          pattern="[0-9]*"
        />
      </p>

      <div className="flex justify-center">
        <div className="grow-0 shrink-0 flex flex-col border-l border-t border-r border-black">
          {multiplicationNumbersRange.map((parentItem, index) => (
            <div
              className="w-[40px] h-[40px] leading-10 border-b border-black text-lg text-center"
              key={`y-axis-${parentItem}`}
            >
              {index}
            </div>
          ))}
        </div>
        <div className="overflow-x-auto">
          <div className="flex border-black">
            {multiplicationNumbersRange.slice(1).map((parentItem, index) => (
              <div
                className="w-[40px] h-[41px] shrink-0 leading-10 border-b border-r border-t border-black text-lg text-center"
                key={`x-axis-${parentItem}`}
              >
                {index + 1}
              </div>
            ))}
          </div>

          {multiplicationNumbersRange.slice(1).map((parentIndex) => (
            <div key={`row-${parentIndex}`} className="flex shrink-0">
              {multiplicationNumbersRange.slice(1).map((childIndex, index) => (
                <div
                  className="w-[40px] h-[40px] shrink-0 leading-10 border-b border-r border-black text-lg text-center"
                  key={`input-${parentIndex}-${childIndex}`}
                >
                  <input
                    className="w-full h-full text-center rounded-none"
                    onChange={handleMultiplicationInput(
                      parentIndex,
                      childIndex
                    )}
                    pattern="[0-9]*"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MultiplicationTable;
