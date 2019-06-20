import React, { useState } from 'react';
import store from '../../store';

const SearchItem: React.FC<IEX.TickerSymbol> = ({ name, symbol }) => {
    const [hovered, toggle] = useState(false)
    return (
        <li className={`list-item ${hovered ? 'is-active' : ''}`}
            onMouseEnter={() => toggle(true)}
            onMouseLeave={() => toggle(false)}
            onClick={() => store.search.addData(symbol, name)}
        >
            {!hovered && <span className="has-text-weight-bold">{symbol}</span>}
            {hovered && <span>{name}</span>}
        </li>
    )
}

export default SearchItem;
