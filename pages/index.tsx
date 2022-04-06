import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [numbersRange, setNumbersRange] = useState(
    new Array(11).fill('').map((a, i) => i)
  );

  const validate = (value: number, column: number, row: number) => {
    return value === column * row;
  };

  const handle =
    (column: number, row: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value === '') {
        event.target.style.backgroundColor = 'white';
        return 
      }
      
      const input = parseInt(event.target.value);

      if (!validate(input, column, row)) {
        event.target.style.backgroundColor = 'red';

        return;
      }

      event.target.style.backgroundColor = 'green';
    };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>range 0 - 10</div>

        <table>
          <tbody>
            {numbersRange.map((parentItem, index) => (
              <tr key={`parent-${parentItem}`}>
                {parentItem !== 0 && <td>{parentItem}</td>}
                {parentItem === 0
                  ? numbersRange.map((childItem, childIndex) => (
                      <td key={`child-${childIndex}`}>{childIndex}</td>
                    ))
                  : numbersRange
                      .filter((i) => i !== 0)
                      .map((childItem, childIndex) => (
                        <td key={`child-${childIndex}`}>
                          <input
                            size={5}
                            onChange={handle(parentItem, childItem)}
                          />
                        </td>
                      ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
