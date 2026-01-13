import React, { useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<Person | null>(null);
  const nameToShow = selected ? selected.name : 'No selected person';
  const bornToShow = selected ? selected.born : '';
  const diedToShow = selected ? selected.died : '';

  const applyQuery = useCallback(debounce(setQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    if (selected !== null) {
      setSelected(null);
    }
  };

  const filteredPeopleList = React.useMemo(() => {
    return peopleFromServer.filter(human => {
      return human.name.includes(query);
    });
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${nameToShow} (${bornToShow} - ${diedToShow})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleQueryChange}
            />
          </div>

          {filteredPeopleList.length > 0 ? (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeopleList.map(person => {
                  return (
                    <div
                      key={person.name}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                    >
                      <p
                        className="has-text-link"
                        onClick={() => setSelected(person)}
                      >
                        {person.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>

        {filteredPeopleList.length === 0 ? (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          ''
        )}
      </main>
    </div>
  );
};
