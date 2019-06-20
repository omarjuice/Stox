import React from 'react';
import { NewTransaction } from '../../store/transactions';
import { observer } from 'mobx-react';

interface Props {
    newTransaction: NewTransaction
}

const BuyForm: React.FC<Props> = observer(({ newTransaction }) => {

    return (
        <form className="form buy-form" onSubmit={(e) => newTransaction.submit(e)}>
            <br />
            <p className="help is-danger">{newTransaction.error}</p>
            <div className="columns is-centered">
                <div className="column is-one-fifth">
                    <div className="field">
                        <div className="control">
                            <input onChange={(e) => newTransaction.set(Number(e.target.value))}

                                className="input is-rounded" value={String(newTransaction.quantity)}
                                type="number" min={1} max={1000000} autoFocus={true} />
                        </div>
                    </div>
                    <br />
                </div>
                <div className="column is-one-fifth">
                    <button className={`button is-success ${newTransaction.loading && 'is-loading'}`}>
                        Buy
                    </button>
                </div>
            </div>
        </form>
    );
})

export default BuyForm;
