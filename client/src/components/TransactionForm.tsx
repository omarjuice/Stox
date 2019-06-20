import React from 'react';
import NewTransaction from '../store/transactions/newTransaction';
import { observer } from 'mobx-react';
import { round, zeroPad } from '../utils';

interface Props {
    newTransaction: NewTransaction
    size: number
}

const BuyForm: React.FC<Props> = observer(({ newTransaction, size }) => {
    return (
        <form className="form buy-form" onSubmit={(e) => newTransaction.submit(e)}>
            <br />
            <h1 className="title is-5">{newTransaction.type} {newTransaction.symbol}</h1>
            <p className="help is-danger is-size-5">{newTransaction.error}</p>
            <div className="is-size-5">{newTransaction.type === 'BUY' ? '-' : '+'}{zeroPad(round(newTransaction.price * newTransaction.quantity))}</div>
            <br />
            <div className="columns is-centered">
                <div className={`column is-${size}`}>
                    <div className="field">
                        <div className="control">
                            <input onChange={(e) => newTransaction.set(Number(e.target.value))}

                                className="input is-rounded has-text-centered" value={String(newTransaction.quantity)}
                                type="number" min={1} max={1000000} autoFocus={true} />
                        </div>
                    </div>
                </div>
                <div className={`column is-${size}`}>
                    <button className={`button is-success ${newTransaction.loading && 'is-loading'}`}>
                        {newTransaction.type}
                    </button>
                </div>
            </div>
            <br />
        </form>
    );
})

export default BuyForm;
