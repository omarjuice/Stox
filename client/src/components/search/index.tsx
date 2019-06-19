import React from 'react';
import { observer } from 'mobx-react';

import SearchBar from './SearchBar';
import SearchView from './SearchView';

const Search: React.FC = observer(() => {
    return (
        <div className="container search">
            <div className="columns">
                <div className="column is-half">
                    <SearchBar />
                </div>
                <div className="column is-half">
                    <SearchView />
                </div>
            </div>
        </div>

    );
})

export default Search;
