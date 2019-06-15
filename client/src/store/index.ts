import API from './api';
class RootStore {
    api: API
    constructor() {
        this.api = new API()
    }
}


export default new RootStore()