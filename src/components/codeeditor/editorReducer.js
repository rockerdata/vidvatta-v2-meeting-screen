export const actionTypes = {
    ADD: 'ADD',
    REMOVE: 'REMOVE',
    INSERT: 'INSERT'
};

export function editorReducer(state, action) {
    switch (action.type) {
        case actionTypes.ADD:
            return [...state, action.payload];

        case actionTypes.REMOVE:
            return state.filter((item, index) => index !== action.payload);

        case actionTypes.INSERT:
            const { index, item } = action.payload;
            return [...state.slice(0, index), item, ...state.slice(index)];

        default:
            return state;
    }
}
