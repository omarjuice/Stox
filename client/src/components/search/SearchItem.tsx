import React, { useState } from 'react';
import store from '../../store';
import { observer } from 'mobx-react-lite';

type Props = IEX.TickerSymbol & { toggle: any }

const SearchItem: React.FC<Props> = observer(({ name, symbol, toggle: toggleList }) => {
    const [hovered, toggle] = useState(false)
    const { search } = store
    return (
        <li className={`list-item ${hovered ? 'is-active' : ''}`}
            onMouseEnter={() => toggle(true)}
            onMouseLeave={() => toggle(false)}
            onClick={() => { search.addData(symbol, name); store.windowWidth < 769 && toggleList(false) }}
        >
            {!hovered && <span className="has-text-weight-bold">{symbol}</span>}
            {hovered && <span>{name}</span>}
        </li>
    )
})

export default SearchItem;
