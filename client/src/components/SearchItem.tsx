import React, { useState } from 'react';

const SearchItem: React.FC<IEX.TickerSymbol> = ({ name, symbol }) => {
    const [hovered, toggle] = useState(false)
    return (
        <li className="list-item is-hoverable"
            onMouseEnter={() => toggle(true)}
            onMouseLeave={() => toggle(false)}>
            {!hovered && <span className="has-text-weight-bold">{symbol}</span>}
            {hovered && <span>{name}</span>}
        </li>
    )
}

export default SearchItem;
