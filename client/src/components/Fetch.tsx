import React from 'react';
import { observer } from 'mobx-react'
import store from '../store'

const Fetch: React.FC = observer(() => {
    const { api } = store;
    if (api.loading) return <div>Loading</div>
    if (api.status !== 200) {
        return <div>
            {(api.error instanceof Error && api.error.message) || api.error}
        </div>
    }
    return <div>{api.data}</div>
})

export default Fetch
