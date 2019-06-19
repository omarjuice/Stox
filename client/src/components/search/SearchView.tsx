

import React from 'react';
import moment from 'moment'
import { observer } from 'mobx-react';
import store from '../../store';
import { zeroPad, compare } from '../../utils';

const SearchView: React.FC = observer(() => {
    const { view } = store.search

    if (view) {
        const comparisonColor = compare(view.last.price, view.ohlc.open)
        return (
            <div className="card">
                <div className="card-header">
                    <p className="card-header-title">
                        {view.symbol}
                    </p>
                    {!view.ohlc.loading && !view.last.loading && (
                        <a onClick={() => store.search.addData(view.symbol, view.name, true)}
                            href="#/" className="card-header-icon" aria-label="refresh">
                            <span className="icon">
                                <i className="fas fa-redo" aria-hidden="true"></i>
                            </span>
                        </a>
                    )}
                </div>
                <div className="card-content has-text-centered">
                    <p className="subtitle is-4">{view.name}</p>
                    <div className="content">
                        <div className="columns is-mobile">
                            <div className="column is-half">
                                {!view.ohlc.loading ? (
                                    <>
                                        {view.ohlc.error ?
                                            <p className="notification is-danger">{view.ohlc.error}</p> :
                                            <>
                                                <div><span className="has-text-weight-bold">open:</span>  {zeroPad(view.ohlc.open)}</div>
                                                <div><span className="has-text-weight-bold">high:</span>  {zeroPad(view.ohlc.high)}</div>
                                                <div><span className="has-text-weight-bold">low:</span>  {zeroPad(view.ohlc.low)}</div>
                                                <div><span className="has-text-weight-bold">close:</span>  {zeroPad(view.ohlc.close)}</div>
                                            </>
                                        }
                                    </>
                                ) : <i className="fas fa-circle-notch fa-spin"></i>}
                            </div>
                            <div className="column is-half">
                                {!view.last.loading ? (
                                    <>
                                        {view.last.error ?
                                            <p className="notification is-danger">{view.last.error}</p> :
                                            <>
                                                <div className="has-text-weight-bold">LAST:</div>
                                                <div >
                                                    <span className={`has-text-weight-bold is-size-4 has-text-${comparisonColor}`}>
                                                        {zeroPad(view.last.price)}
                                                    </span> X {view.last.size}
                                                </div>
                                                <div>{moment.utc(view.last.time).local().format('MM/DD/YY h:mm:ssa')}</div>
                                            </>}
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