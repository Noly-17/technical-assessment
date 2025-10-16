import React, { useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

const languages = ['JavaScript', 'Python'];

// Create the context
const FavoriteLanguageContext = createContext();

function App() {
  // State for the favorite language index
  const [favoriteIdx, setFavoriteIdx] = useState(0);

  // Toggle function
  const toggleFavorite = () => {
    setFavoriteIdx((prevIdx) => (prevIdx + 1) % languages.length);
  };

  return (
    <FavoriteLanguageContext.Provider
      value={{ favorite: languages[favoriteIdx], toggleFavorite }}
    >
      <MainSection />
    </FavoriteLanguageContext.Provider>
  );
}

function MainSection() {
  // Consume the context
  const { favorite, toggleFavorite } = useContext(FavoriteLanguageContext);
  return (
    <div>
      <p id="favoriteLanguage">favorite programing language: {favorite}</p>
      <button id="changeFavorite" onClick={toggleFavorite}>
        toggle language
      </button>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

const https = require('https');

const CHALLENGE_TOKEN = '1Incjmyk69';

https
  .get('https://coderbyte.com/api/challenges/json/age-counting', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      try {
        // Parse the JSON data
        const json = JSON.parse(data);
        // Get the 'data' string
        const dataStr = json.data;
        // Split into key-value pairs
        const pairs = dataStr.split(', ');
        // Count how many have age >= 50
        let count = 0;
        for (let pair of pairs) {
          if (pair.startsWith('age=')) {
            const age = parseInt(pair.split('=')[1], 10);
            if (age >= 50) count++;
          }
        }
        // Print the count
        console.log(count);
        // Concatenate with ChallengeToken
        let output = count.toString() + CHALLENGE_TOKEN;
        // Replace every third character with 'X'
        output = output
          .split('')
          .map((ch, i) => ((i + 1) % 3 === 0 ? 'X' : ch))
          .join('');
        console.log(output);
      } catch (e) {
        console.error('Error parsing data:', e);
      }
    });
  })
  .on('error', (err) => {
    console.error('Error with request:', err);
  });

function PhoneBookForm({ addEntryToPhoneBook }) {
  const [firstName, setFirstName] = useState('Coder');
  const [lastName, setLastName] = useState('Byte');
  const [phone, setPhone] = useState('8885559999');

  const handleSubmit = (e) => {
    e.preventDefault();
    addEntryToPhoneBook({ firstName, lastName, phone });
    setFirstName('Coder');
    setLastName('Byte');
    setPhone('8885559999');
  };

  return (
    <form onSubmit={handleSubmit} style={style.form.container}>
      <label>First name:</label>
      <br />
      <input
        style={style.form.inputs}
        className="userFirstname"
        name="userFirstname"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <br />
      <label>Last name:</label>
      <br />
      <input
        style={style.form.inputs}
        className="userLastname"
        name="userLastname"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <br />
      <label>Phone:</label>
      <br />
      <input
        style={style.form.inputs}
        className="userPhone"
        name="userPhone"
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />
      <input
        style={style.form.submitBtn}
        className="submitButton"
        type="submit"
        value="Add User"
      />
    </form>
  );
}

function InformationTable({ entries }) {
  return (
    <table style={style.table} className="informationTable">
      <thead>
        <tr>
          <th style={style.tableCell}>First name</th>
          <th style={style.tableCell}>Last name</th>
          <th style={style.tableCell}>Phone</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, idx) => (
          <tr key={idx}>
            <td style={style.tableCell}>{entry.firstName}</td>
            <td style={style.tableCell}>{entry.lastName}</td>
            <td style={style.tableCell}>{entry.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Application(props) {
  const [phoneBook, setPhoneBook] = useState([]);

  const addEntryToPhoneBook = (entry) => {
    setPhoneBook((prev) => {
      const newList = [...prev, entry];
      // Sort by last name
      newList.sort((a, b) => a.lastName.localeCompare(b.lastName));
      return newList;
    });
  };

  return (
    <section>
      <PhoneBookForm addEntryToPhoneBook={addEntryToPhoneBook} />
      <InformationTable entries={phoneBook} />
    </section>
  );
}

// --- Coderbyte Back-end Challenge Solution ---
const fs = require('fs');
const crypto = require('crypto');
const https2 = require('https');

https2
  .get('https://coderbyte.com/api/challenges/json/age-counting', (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      try {
        const json = JSON.parse(data);
        const dataStr = json.data;
        const pairs = dataStr.split(', ');
        const result = [];
        let lastKey = null;
        for (let pair of pairs) {
          if (pair.startsWith('key=')) {
            lastKey = pair.split('=')[1];
          } else if (pair.startsWith('age=')) {
            const age = parseInt(pair.split('=')[1], 10);
            if (age === 32 && lastKey) {
              result.push(lastKey);
            }
          }
        }
        // Write to output.txt
        fs.writeFileSync('output.txt', result.join('\n'));
        // Compute SHA1 hash
        const fileContent = fs.readFileSync('output.txt', 'utf8');
        const hash = crypto
          .createHash('sha1')
          .update(fileContent)
          .digest('hex');
        console.log(hash);
        // --- ChallengeToken step (optional) ---
        // let output = hash + CHALLENGE_TOKEN;
        // output = output.split('').map((ch, i) => ((i + 1) % 3 === 0 ? 'X' : ch)).join('');
        // console.log(output);
      } catch (e) {
        console.error('Error:', e);
      }
    });
  })
  .on('error', (err) => {
    console.error('Error with request:', err);
  });
