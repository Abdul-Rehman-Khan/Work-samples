import {
    cloneDeep
} from 'lodash';
import * as Types from '../actions/actionTypes';

const defaultState = {
    data: {
        initialValues: [],
        currentValues: []
    },
    pending: false,
    error: false,
    validation: {
        valid: true,
        errorMessage: ''
    },
    editingRowIndex: null,
    topicListSave: {
        pending: false,
        error: false
    }
};

function updateTopicProperty(state, index, property, newValue) {
    const temp = [...state.data.currentValues];
    temp[index] = {
        ...temp[index],
        [property]: newValue
    };
    return {
        ...state,
        data: {
            ...state.data,
            currentValues: temp
        }
    };
}

function onTopicListFetchSuccess(state, data) {
    return {
        ...state,
        data: {
            initialValues: data,
            currentValues: cloneDeep(data)
        },
        pending: false,
        error: false
    };
}

const topicManagementReducer = (state = defaultState, action) => {
    switch (action.type) {
        case Types.TOPIC_CONFIG_LIST_FETCH:
            return {
                ...state,
                pending: true
            };

        case Types.TOPIC_CONFIG_LIST_FETCH_SUCCESS:
            return onTopicListFetchSuccess(state, action.payload);

        case Types.TOPIC_CONFIG_LIST_FETCH_FAILURE:
            return {
                ...state,
                pending: false,
                    error: action.payload
            };

        case Types.TOPIC_CONFIG_LIST_TITLE_CHANGE: {
            const updatedState = updateTopicProperty(
                state,
                action.payload.index,
                'title',
                action.payload.value
            );
            updatedState.validation = action.payload.validation;
            return updatedState;
        }

        case Types.TOPIC_CONFIG_LIST_STATUS_CHANGE:
            return updateTopicProperty(
                state,
                action.payload.index,
                'status',
                action.payload.checked === true ? 1 : 2
            );

        case Types.TOPIC_CONFIG_LIST_CANCEL:
            return {
                ...state,
                data: {
                    ...state.data,
                    currentValues: cloneDeep(state.data.initialValues)
                }
            };

        case Types.TOPIC_CONFIG_LIST_SAVE:
            return {
                ...state,
                topicListSave: {
                    ...state.topicListSave,
                    pending: true
                }
            };

        case Types.TOPIC_CONFIG_LIST_SAVE_SUCCESS: {
            const updatedState = onTopicListFetchSuccess(state, action.payload);
            updatedState.topicListSave = {
                pending: false,
                error: false
            };
            return updatedState;
        }

        case Types.TOPIC_CONFIG_LIST_SAVE_FAILURE:
            return {
                ...state,
                topicListSave: {
                    pending: false,
                    error: action.payload
                }
            };

        case Types.TOPIC_CONFIG_LIST_CREATE_TOPIC:
            return {
                ...state,
                data: {
                        ...state.data,
                        currentValues: [...state.data.currentValues, action.payload]
                    },
                    editingRowIndex: state.data.currentValues.length,
                    valid: false
            };

        case Types.TOPIC_CONFIG_LIST_TITLE_BLUR:
            return {
                ...state,
                editingRowIndex: null
            };

        case Types.TOPIC_CONFIG_LIST_TITLE_CLICK:
            return {
                ...state,
                editingRowIndex: action.payload
            };

        default:
            return state;
    }
};

export default topicManagementReducer;

export const selectTopicConfigListSlice = (state, slice) =>
    state.topicConfiguration[slice];
export const selectTopicConfigListValues = state =>
    state.topicConfiguration.data.currentValues;
