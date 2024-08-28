import React, { createRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export interface Problem {
  left: number;
  right: number;
  type: string;
  passed?: boolean;
  time?: number;
  elapsed?: number;
}

const ProblemGenerator: React.FC = () => {
  const [generatedProblems, setGeneratedProblems] = useState<Problem[]>([]);
  const [problemType, setProblemType] = useState([
    { name: 'Addition', symbol: '+', checked: true },
    { name: 'Subtraction', symbol: '-', checked: false },
    { name: 'Multiplication', symbol: '*', checked: false },
    { name: 'Division', symbol: '/', checked: false },
  ]);
  const [numberOfProblems, setNumberOfProblems] = useState(10);
  const [problemMin, setProblemMin] = useState(1);
  const [problemMax, setProblemMax] = useState(10);

  const problemRefs = useRef([]);

  const [time, setTime] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const onlyNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '' && !/^[0-9\b]+$/.test(event.target.value)) {
      event.target.style.backgroundColor = 'white';

      event.target.value = event.target.value.replace(/[a-zA-Z;:\/\?]/gm, '');
      return false;
    }

    return true;
  };

  const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const readableType = (type: string) => {
    const map: { [key: string]: string } = {
      '+': '+',
      '-': '-',
      '*': 'x',
      '/': '÷',
    };

    return map[type];
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

  const generateProblems = () => {
    if (problemMin >= problemMax || isNaN(problemMin) || isNaN(problemMax))
      return;

    handleReset();
    handleStart();

    const problems: Problem[] = [];

    const selectedProblemTypes = problemType.filter((type) => type.checked);

    for (let index = 0; index < numberOfProblems; index++) {
      const left = randomNumber(problemMin, problemMax);
      const right = randomNumber(problemMin, problemMax);

      problems.push({
        left,
        right,
        type: selectedProblemTypes[
          Math.floor(Math.random() * selectedProblemTypes.length)
        ].symbol,
      });
    }

    if (problemRefs.current.length !== problems.length) {
      problemRefs.current = Array(problems.length)
        .fill('')
        .map((_, i) => problemRefs.current[i] || createRef());
    }

    setGeneratedProblems(problems);
  };

  const getAnswer = (problem: Problem): number | null => {
    let result: number | null = null;

    switch (problem.type) {
      case '+':
        result = problem.left + problem.right;
        break;
      case '-':
        result = problem.left - problem.right;
        break;
      case '*':
        result = problem.left * problem.right;
        break;
      case '/':
        result = problem.left / problem.right;
        break;
    }

    return result ?? null;
  }

  const isCorrect = (input: number, answer: number | null) => {
    return Math.abs(input).toFixed(2) === Math.abs(answer ?? 0)?.toFixed(2);
  };

  const handleProblemType = (index: number) => () => {
    const update = [...problemType];
    update[index].checked = !update[index].checked;

    setProblemType(update);
  };

  const handleProblemInput =
    (problem: Problem) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!onlyNumber(event)) {
        return;
      }

      if (isPaused) handlePauseResume();

      const input = parseFloat(event.target.value);

      const answer = getAnswer(problem);
      if (!isCorrect(input, answer)) {
        event.target.style.backgroundColor = 'red';
        event.target.style.color = 'white';

        return;
      }

      if (answer && answer < 0) {
        event.target.value = `-${input}`;
      }

      problem.passed = true;
      problem.time = time;
      problem.elapsed = lastTime > 0 ? time - lastTime : time;

      setLastTime(time);

      event.target.style.backgroundColor = 'green';
      event.target.style.color = 'white';

      focusNextInput(event);

      if (
        generatedProblems.length &&
        generatedProblems.every((problem) => problem.passed === true) &&
        !isPaused
      ) {
        handlePauseResume();
      }
    };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  useEffect(() => {
    problemRefs.current.forEach((item: any) => {
      if (!item.current) return;

      item.current.value = '';
      item.current.style.backgroundColor = '#fff';
      item.current.style.color = '#000';
    });
  }, [generatedProblems]);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  return (
    <section className="flex flex-col justify-center items-center">
      <div className="max-w-md mb-8">
        <h2 className="print-hide mt-10 font-bold text-2xl text-center mb-4">
          Generate random math problems
        </h2>

        <div className="print-hide pl-4 pr-4 mb-4">
          <div className="font-bold mb-4">Type of problem</div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {problemType.map((type, index) => {
              return (
                <div
                  key={index}
                  onClick={handleProblemType(index)}
                  className="flex items-center gap-2"
                >
                  <input
                    name="problemType"
                    type="checkbox"
                    checked={type.checked}
                    value={type.symbol}
                    onChange={handleProblemType(index)}
                    pattern="[0-9]*"
                    className=""
                  />
                  <label className="ml-1" htmlFor="problemType">
                    {type.name}
                  </label>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 items-center gap-4 mb-8">
            <div className="font-bold">Number of problems</div>
            <input
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
              value={numberOfProblems}
              onChange={(event) =>
                setNumberOfProblems(parseInt(event.target.value))
              }
              placeholder="0"
              type="text"
              size={4}
              pattern="[0-9]*"
            />

            <div className="font-bold">Number range </div>
            <div className="flex gap-4 items-center">
              <input
                className="grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                value={problemMin}
                onChange={(event) =>
                  setProblemMin(parseInt(event.target.value))
                }
                placeholder="0"
                type="text"
                size={4}
                pattern="[0-9]*"
              />
              <span>-</span>
              <input
                className=" grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                value={problemMax}
                onChange={(event) =>
                  setProblemMax(parseInt(event.target.value))
                }
                placeholder="0"
                type="text"
                size={4}
                pattern="[0-9]*"
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="mb-4 grow " onClick={handlePauseResume}>
              <div className="flex gap-1 items-center mt-4">
                <div className="h-[1.875rem]">
                  <Image
                    src="/timer-icon.svg"
                    alt="timer"
                    width={30}
                    height={30}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <Time time={time} />
              </div>
            </div>
            <div className="">
              <button
                className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
                onClick={generateProblems}
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        {problemType.find(
          (type) => type.name === 'Division' && type.checked
        ) && (
          <p className="text-sm mb-8">
            *precision to the nearest hundredth decimal exp: 1.03
          </p>
        )}

        <div className="grid grid-cols-2 gap-8 items-center">
          {generatedProblems.map((problem, index) => {
            return (
              <div
                key={`problem-${index}`}
                className="flex items-center gap-4"
                style={{ position: 'relative' }}
              >
                <div className="grow text-right relative">
                  {`${problem.left} ${readableType(problem.type)} ${
                    problem.right
                  } = `}
                  {problem.elapsed && (
                    <div
                      style={{
                        position: 'absolute',
                        display: 'flex',
                        gap: '0.15rem',
                        right: '-4px',
                        color: '#99D492',
                      }}
                    >
                      <Time time={problem.elapsed} />
                      <Image
                        src="/timer-icon.svg"
                        alt="timer"
                        width={15}
                        height={15}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  )}
                </div>
                <input
                  className="grow-0 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-400"
                  size={5}
                  ref={problemRefs.current[index]}
                  onChange={handleProblemInput(problem)}
                  pattern="[0-9]*"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemGenerator;

const Time = ({ time }: { time: number }) => {
  return (
    <div className="timer">
      <span className="digits">
        {('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
      </span>
      <span className="digits">
        {('0' + Math.floor((time / 1000) % 60)).slice(-2)}.
      </span>
      <span className="digits mili-sec">
        {('0' + ((time / 10) % 100)).slice(-2)}
      </span>
    </div>
  );
};
