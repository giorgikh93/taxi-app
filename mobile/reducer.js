


export const initialState = {
    token: ''
}


const reducer = (state, action) => {
    switch (action.type) {
        case 'SET__TOKEN':
            return { ...state, token: action.payload }
        default:
            return state;
    }
}

export default reducer