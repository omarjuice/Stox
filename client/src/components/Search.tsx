import React from 'react';
import { observer } from 'mobx-react-lite';
import store from '../store';
import SearchItem from './SearchItem';

const Search: React.FC = observer(() => {
    return (
        <div className="stocks-search">
            <input className="input is-large" type="text" onChange={(e) => store.stocks.input = e.target.value.toUpperCase()} value={store.stocks.input} />
            <div className="list">
                {store.stocks.list.map((stock, i) => {
                    return <SearchItem key={i}  {...stock} />
                })}
            </div>
        </div>
    );
})

export default Search;
