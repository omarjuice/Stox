

import React, { useState } from 'react';
import { observer } from 'mobx-react';
import store from '../../store';
import SearchItem from './SearchItem';

const SearchBar: React.FC = observer(() => {
    const { search } = store
    const [active, toggle] = useState(true)
    return (
        <div className="is-fullwidth">
            <div className="field">
                <div className="control has-icons-right">
                    <input className="input is-large" type="text" placeholder="Search by ticker symbol"
                        onFocus={() => toggle(true)}
                        onChange={(e) => search.set(e.target.value)} value={search.input} />
                    {search.loading && <span className="icon is-small is-right">
                        <i className="fas fa-circle-notch fa-spin"></i>
                    </span>}
                </div>
            </div>
            {active && <div className="list">
                {search.list.map((stock, i) => {
                    return <SearchItem toggle={toggle} key={i}  {...stock} />
                })}
            </div>}

        </div>
    );
})

export default SearchBar;
