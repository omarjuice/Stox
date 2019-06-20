import React from 'react';

import SearchBar from './SearchBar';
import SearchView from './SearchView';

const Search: React.FC = () => {
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
}

export default Search;
