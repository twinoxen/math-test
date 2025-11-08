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
      event.target.classList.remove('input-incorrect');
      event.target.classList.add('input');

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
      '*': '×',
      '/': '÷',
    };

    return map[type];
  };

  const focusNextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (!input) return;

    const allInputs = document.querySelectorAll('input[pattern="[0-9]*"]');

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

  const handleProblemType = (index: number) => (event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>) => {
    // Prevent event bubbling to avoid double-toggle
    event.stopPropagation();
    
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
        event.target.classList.add('animate-incorrect');
        event.target.classList.remove('input-correct');
        event.target.classList.add('input-incorrect');
        setTimeout(() => event.target.classList.remove('animate-incorrect'), 500);
        return;
      }

      if (answer && answer < 0) {
        event.target.value = `-${input}`;
      }

      problem.passed = true;
      problem.time = time;
      problem.elapsed = lastTime > 0 ? time - lastTime : time;

      setLastTime(time);

      event.target.classList.add('animate-correct');
      event.target.classList.remove('input-incorrect');
      event.target.classList.add('input-correct');
      setTimeout(() => event.target.classList.remove('animate-correct'), 600);

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
      item.current.classList.remove('input-correct', 'input-incorrect');
      item.current.classList.add('input');
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
    <section className="flex flex-col justify-center items-center px-0 sm:px-4">
      <div className="w-full max-w-4xl">
        {/* Settings Card */}
        <div className="card p-6 sm:p-8 mb-8 animate-scale-in">
          <h2 className="print-hide text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎯 Problem Generator
          </h2>

          <div className="print-hide space-y-8">
            {/* Problem Types */}
            <div className="animate-slide-in">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Problem Types</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {problemType.map((type, index) => {
                  const icons = { '+': '➕', '-': '➖', '*': '✖️', '/': '➗' };
                  return (
                    <div
                      key={index}
                      onClick={handleProblemType(index)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        type.checked
                          ? 'border-blue-400 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {/* Hidden checkbox for accessibility */}
                      <input
                        name="problemType"
                        type="checkbox"
                        checked={type.checked}
                        value={type.symbol}
                        onChange={() => {}} 
                        className="sr-only"
                        aria-label={type.name}
                      />
                      
                      {/* Green checkmark indicator in upper left */}
                      {type.checked && (
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                          <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xl">{icons[type.symbol as keyof typeof icons]}</span>
                        <label className="font-medium text-gray-700 cursor-pointer">
                          {type.name}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-in">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Number of Problems
                    </label>
                    <input
                      className="input w-full max-w-24 sm:max-w-32"
                      value={numberOfProblems}
                      onChange={(event) =>
                        setNumberOfProblems(parseInt(event.target.value))
                      }
                      placeholder="10"
                      type="text"
                      pattern="[0-9]*"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Number Range
                    </label>
                    <div className="flex gap-2 sm:gap-3 items-center">
                      <input
                        className="input w-16 sm:w-20 text-center"
                        value={problemMin}
                        onChange={(event) =>
                          setProblemMin(parseInt(event.target.value))
                        }
                        placeholder="1"
                        type="text"
                        pattern="[0-9]*"
                      />
                      <span className="text-gray-500 font-medium text-sm">to</span>
                      <input
                        className="input w-16 sm:w-20 text-center"
                        value={problemMax}
                        onChange={(event) =>
                          setProblemMax(parseInt(event.target.value))
                        }
                        placeholder="10"
                        type="text"
                        pattern="[0-9]*"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer and Generate */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Timer</h3>
                <div className="glass-card p-4 rounded-xl">
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-200" 
                    onClick={handlePauseResume}
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Image
                        src="/timer-icon.svg"
                        alt="timer"
                        width={24}
                        height={24}
                        className="opacity-80"
                      />
                    </div>
                    <Time time={time} />
                  </div>
                </div>
                
                <button
                  className="btn btn-success w-full py-4 text-lg font-semibold animate-bounce"
                  onClick={generateProblems}
                >
                  🚀 Generate Problems
                </button>
              </div>
            </div>
          </div>

          {problemType.find(
            (type) => type.name === 'Division' && type.checked
          ) && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-fade-in">
              <p className="text-sm text-yellow-800">
                💡 <strong>Division tip:</strong> Round to the nearest hundredth (e.g., 1.03)
              </p>
            </div>
          )}
        </div>

        {/* Problems Grid */}
        {generatedProblems.length > 0 && (
          <div className="card p-6 sm:p-8 animate-scale-in">
            <h3 className="text-xl font-semibold text-center mb-6 text-gray-700">
              Solve These Problems! 🧮
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedProblems.map((problem, index) => {
                return (
                  <div
                    key={`problem-${index}`}
                    className="glass-card p-4 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-lg font-medium text-gray-700 relative">
                        {`${problem.left} ${readableType(problem.type)} ${
                          problem.right
                        } =`}
                        {problem.elapsed && (
                          <div className="absolute -top-6 right-0 flex items-center gap-1 text-xs text-green-600">
                            <Time time={problem.elapsed} />
                            <Image
                              src="/timer-icon.svg"
                              alt="timer"
                              width={12}
                              height={12}
                            />
                          </div>
                        )}
                      </div>
                      <input
                        className="input w-16 sm:w-20 text-center font-medium"
                        ref={problemRefs.current[index]}
                        onChange={handleProblemInput(problem)}
                        pattern="[0-9]*"
                        placeholder="?"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {generatedProblems.every((problem) => problem.passed) && generatedProblems.length > 0 && (
              <div className="mt-8 text-center animate-bounce">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-xl font-semibold text-green-600">
                  Congratulations! You solved all problems!
                </p>
              </div>
            )}
          </div>
        )}
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