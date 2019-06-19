

import React from 'react';
import { observer } from 'mobx-react';
import store from '../store';


const SearchView: React.FC = observer(() => {
    const { view } = store.search
    if (view) {
        return (
            <div className="card">
                <div className="card-header">
                    <p className="card-header-title">
                        {view.symbol}
                    </p>
                </div>
                <div className="card-content has-text-centered">
                    <p className="subtitle is-4">{view.name}</p>

                    <div className="content">
                        <div className="columns is-mobile">
                            <div className="column is-half">
                                {!view.ohlc.loading ? (
                                    <>
                                        <div>{view.ohlc.open}</div>
                                        <div>{view.ohlc.high}</div>
                                        <div>{view.ohlc.low}</div>
                                        <div>{view.ohlc.close}</div>
                                    </>
                                ) : <i className="fas fa-circle-notch fa-spin"></i>}
                            </div>
                            <div className="column is-half">
                                {!view.last.loading ? (
                                    <>
                                        <div>{view.last.price}</div>
                                        <div>{view.last.time}</div>
                                    </>
                                ) : <i className="fas fa-circle-notch fa-spin"></i>}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
    return null


})

export default SearchView;