import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Person | null>(null);

  const applyQuery = React.useCallback(
    debounce((nextValue: string) => {
      setQuery(nextValue);
    }, 300),
    []
  );

  const handleSelectPerson = (person: Person) => {
    setSelected(person);
    setAppliedQuery(person.name);
    setQuery(person.name);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setAppliedQuery(value);

    applyQuery(value);

    if (selected) {
      setSelected(null);
    }
  };

  const filteredPeopleList = React.useMemo(() => {
    if (!query.trim()) return peopleFromServer;

    return peopleFromServer.filter(human =>
      human.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="container">
      <main className="section">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <input
            type="text"
            className="input"
            value={appliedQuery}
            onChange={handleQueryChange}
            placeholder="Enter a part of the name"
            data-cy="search-input"
          />

          {appliedQuery && filteredPeopleList.length > 0 && (
            <div className="dropdown-menu">
              <div className="dropdown-content">
                {filteredPeopleList.map(person => (
                  <a
                    key={person.name}
                    className="dropdown-item"
                    onClick={() => handleSelectPerson(person)}
                  >
                    {person.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
