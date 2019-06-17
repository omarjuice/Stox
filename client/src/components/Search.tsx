import React from 'react';
import { observer } from 'mobx-react-lite';
import store from '../store';
import SearchItem from './SearchItem';

const Search: React.FC = observer(() => {
    return (
        <div className="stocks-search">
            <div className="field">
                <div className="control has-icons-right">
                    <input className="input is-large" type="text" placeholder="Search by ticker symbol"

                        onChange={(e) => store.stocks.input = e.target.value.toUpperCase()} value={store.stocks.input} />
                    {store.stocks.loading && <span className="icon is-small is-right">
                        <i className="fas fa-circle-notch fa-spin"></i>
                    </span>}
                </div>
            </div>
            <div className="list">
                {store.stocks.list.map((stock, i) => {
                    return <SearchItem key={i}  {...stock} />
                })}
            </div>
        </div>
    );
})

export default Search;
