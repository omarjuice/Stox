import React, { Component } from 'react';

class SearchItem extends Component<IEX.TickerSymbol> {
    state = {
        hovered: false
    }
    render() {
        return (
            <li className="list-item"
                onMouseEnter={() => this.setState({ hovered: true })}
                onMouseLeave={() => this.setState({ hovered: false })}>
                {!this.state.hovered && <span className="has-text-weight-bold">{this.props.symbol}</span>}
                {this.state.hovered && <span>{this.props.name}</span>}
            </li>
        );
    }
}

export default SearchItem;
