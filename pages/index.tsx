import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';

export interface Problem {
  left: number;
  right: number;
  type: string;
  passed?: boolean;
  time?: number;
  elapsed?: number;
}

const Home: NextPage = () => {
  const [generatedProblems, setGeneratedProblems] = useState<Problem[]>([]);
  const [problemType, setProblemType] = useState('+');
  const [numberOfProblems, setNumberOfProblems] = useState(5);
  const [problemMin, setProblemMin] = useState(1);
  const [problemMax, setProblemMax] = useState(10);

  const problemRefs = useRef([]);

  const [time, setTime] = useState(0);
  const [lastTime, setLastTime] = useState(0)
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

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
    const inputs = Array.from(document.querySelectorAll('input'));

    const index = inputs.findIndex((input) => input === event.target);

    if (!index || index >= inputs.length) return;

    inputs[index + 1].focus();
  };

  const generateProblems = () => {
    if (problemMin >= problemMax || isNaN(problemMin) || isNaN(problemMax))
      return;

    handleReset();
    handleStart();

    const problems: Problem[] = [];

    for (let index = 0; index < numberOfProblems + 1; index++) {
      const left = randomNumber(problemMin, problemMax);
      const right = randomNumber(problemMin, problemMax);
      problems.push({ left, right, type: problemType });
    }

    if (problemRefs.current.length !== problems.length) {
      problemRefs.current = Array(problems.length)
        .fill('')
        .map((_, i) => problemRefs.current[i] || createRef());
    }

    setGeneratedProblems(problems);
  };

  const evaluate = (input: number, problem: Problem) => {
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

    return input.toFixed(2) === result?.toFixed(2);
  };

  const handleProblemInput =
    (problem: Problem) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!onlyNumber(event)) {
        return;
      }

      if (isPaused) handlePauseResume();

      const input = parseFloat(event.target.value);

      if (!evaluate(input, problem)) {
        event.target.style.backgroundColor = 'red';
        event.target.style.color = 'white';

        return;
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
    <div className={styles.container}>
      <Head>
        <title>Can you do the maths?</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Do you even math? 🤷‍♂️</h1>
        <h2 style={{ marginTop: '4rem' }}>Generate random math problems</h2>

        <div className={styles.form}>
          <div className={styles.formItem}>Type of problem </div>
          <div className={styles.formItem}>
            <select
              className={styles.select}
              value={problemType}
              onChange={(event) => setProblemType(event.target.value)}
            >
              <option value="+">Addition</option>
              <option value="-">Subtraction</option>
              <option value="*">Multiplication</option>
              <option value="/">Division</option>
            </select>
          </div>
          <div className={styles.formItem}>Number of problems</div>
          <div className={styles.formItem}>
            <input
              className={styles.rangeInput}
              value={numberOfProblems}
              onChange={(event) =>
                setNumberOfProblems(parseInt(event.target.value))
              }
              placeholder="0"
              type="text"
              size={4}
            />{' '}
          </div>
          <div className={styles.formItem}>Number range </div>
          <div className={styles.formItem}>
            <input
              className={styles.rangeInput}
              value={problemMin}
              onChange={(event) => setProblemMin(parseInt(event.target.value))}
              placeholder="0"
              type="text"
              size={4}
            />{' '}
            -{' '}
            <input
              className={styles.rangeInput}
              value={problemMax}
              onChange={(event) => setProblemMax(parseInt(event.target.value))}
              placeholder="0"
              type="text"
              size={4}
            />
          </div>
          <div className={styles.formItem}>
            <div
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <div onClick={handlePauseResume}>
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
          <div className={styles.formItem}>
            <button className={styles.button} onClick={generateProblems}>
              Generate
            </button>
          </div>
        </div>

        {problemType === '/' && (
          <p style={{ marginTop: '3rem' }}>
            precision to the nearest hundredth decimal exp: 1.03
          </p>
        )}

        <div className={styles.problems}>
          {generatedProblems.map((problem, index) => {
            return (
              <div
                key={`problem-${index}`}
                className={styles.problem}
                style={{ position: 'relative' }}
              >
                {`${problem.left} ${readableType(problem.type)} ${
                  problem.right
                } = `}
                <input
                  className={styles.multiplyTableInput}
                  size={5}
                  ref={problemRefs.current[index]}
                  onChange={handleProblemInput(problem)}
                />
                {problem.elapsed && (
                  <div
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      gap: '0.15rem',
                      right: '0.4rem',
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
            );
          })}
        </div>

        <h2>Multiplication Table</h2>
        <p>
          Number range{' '}
          <input
            className={styles.rangeInput}
            value={multiplicationMin}
            onChange={setMultiMin}
            placeholder="0"
            type="text"
            size={4}
          />{' '}
          -{' '}
          <input
            className={styles.rangeInput}
            value={multiplicationMax}
            onChange={setMultiMax}
            placeholder="0"
            type="text"
            size={4}
          />
        </p>
        <div className={styles.table}>
          <table>
            <tbody>
              {multiplicationNumbersRange.map((parentItem, index) => (
                <tr key={`parent-${parentItem}`}>
                  {parentItem !== multiplicationNumbersRange[0] && (
                    <td className={styles.multiplyTableHeader}>{parentItem}</td>
                  )}
                  {parentItem === multiplicationNumbersRange[0]
                    ? multiplicationNumbersRange.map(
                        (childItem, childIndex) => (
                          <td
                            className={styles.multiplyTableHeader}
                            key={`child-${childIndex}`}
                          >
                            {childItem}
                          </td>
                        )
                      )
                    : multiplicationNumbersRange
                        .filter((i) => i !== multiplicationNumbersRange[0])
                        .map((childItem, childIndex) => (
                          <td key={`child-${childIndex}`}>
                            <input
                              className={styles.multiplyTableInput}
                              size={5}
                              onChange={handleMultiplicationInput(
                                parentItem,
                                childItem
                              )}
                            />
                          </td>
                        ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

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

export default Home;
