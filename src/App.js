import './App.css';
import close from "./close.svg";
import refresh from "./reload.svg";
import axios from "axios";
import { useEffect, useState } from 'react';

const peopleService = axios.create({
  baseURL: 'https://na-random-service.herokuapp.com/'
});

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function App() {
  const [person, setPerson] = useState("");
  const [people, setPeople] = useState([]);
  const [randomisedPeople, setRandomisedPeople] = useState([]);
  const createPerson = (e) => {
    e.preventDefault();
    setPerson("");
    const existingPerson = people.find(p => p.name.toLowerCase() === person.toLowerCase());
    if (existingPerson) return;
    peopleService.post("/people", { name: person }).then(({ data }) => {
      setPeople([...people, data]);
    });
  };
  const removePerson = (id) => {
    peopleService.delete(`/people/${id}`).then(() => {
      setPeople(people.filter(person => person.id !== id));
    });
  }
  const onPersonChange = (e) => {
    setPerson(e.target.value);
  };
  const randomisePeople = () => {
    setRandomisedPeople(shuffle([...people]));
  };
  useEffect(randomisePeople, [people])
  useEffect(() => {
    peopleService.get("/people").then(({ data }) => {
      setPeople(data);
    });
  }, []);
  return (
    <div className="Main">
      <h1>Non Audit Team</h1>
      <div className="App">
        <div className="App-people">
          <form onSubmit={createPerson}>
            <input value={person} onChange={onPersonChange} placeholder="Enter a name" />
          </form>
          <ul className="App-list">
            {
              people.map(person => {
                return <li key={person.id}>
                  <span>{person.name}</span>
                  <a onClick={() => removePerson(person.id)} className="App-delete">
                    <img src={close} alt="delete" />
                  </a>
                </li>;
              })
            }
          </ul>
        </div>
        {
          people.length > 2 ?
          <div className="App-random">
            <div className="App-random-title">
              <h2>Randomised List</h2>
              <a onClick={randomisePeople} className="App-random-reload">
                <img src={refresh} alt="refresh" />
              </a>
            </div>
            <ul className="App-list">
              {
                randomisedPeople.map(person => {
                  return <li key={person.id}>
                    <span>{person.name}</span>
                  </li>;
                })
              }
            </ul>
          </div> : null
        }
      </div>
      <h3 className="App-copyright">&#169; DataGuard</h3>
    </div>
  );
}

export default App;
