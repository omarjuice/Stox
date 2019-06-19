

import React from 'react';
import { observer } from 'mobx-react';
import store from '../store';
import SearchItem from './SearchItem';

const SearchBar: React.FC = observer(() => {
    return (
        <div className="is-fullwidth">
            <div className="field">
                <div className="control has-icons-right">
                    <input className="input is-large" type="text" placeholder="Search by ticker symbol"

                        onChange={(e) => store.search.input = e.target.value.toUpperCase()} value={store.search.input} />
                    {store.search.loading && <span className="icon is-small is-right">
                        <i className="fas fa-circle-notch fa-spin"></i>
                    </span>}
                </div>
            </div>
            <div className="list">
                {store.search.list.map((stock, i) => {
                    return <SearchItem key={i}  {...stock} />
                })}
            </div>

        </div>
    );
})

export default SearchBar;
