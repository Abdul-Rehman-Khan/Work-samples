import { error } from 'util';

import * as api from '../api/topicConfigApi';
import * as Types from '../actions/actionTypes';
import { selectTopicConfigListValues } from '../reducers/topicConfigurationReducer';

/**
 *
 * @param {string} title - Updated title
 * @param {string[]} allTitles - All title in topic config list
 */
const validateTitle = (title, allTitles) => {
	let validationObj;
	if (title === '') {
		validationObj = {
			valid: false,
			errorMessage: 'Title cannot be empty. Please fill it in'
		};
	} else if (allTitles.includes(title)) {
		validationObj = {
			valid: false,
			errorMessage: 'Title must be unique'
		};
	} else {
		validationObj = {
			valid: true,
			errorMessage: ''
		};
	}
	return validationObj;
};

/**
 *
 * @param {Object} data
 * @param {string} data.value - Value of new title
 * @param {number} data.index - Index of updated topic in topic list
 * @returns {{ type: string, payload: Object }}
 */
export function changeTitle(data) {
	return (dispatch, getState) => {
		const allTitles = selectTopicConfigListValues(getState()).map(
			topic => topic.title
		);
		dispatch({
			type: Types.TOPIC_CONFIG_LIST_TITLE_CHANGE,
			payload: {
				...data,
				validation: validateTitle(data.value, allTitles)
			}
		});
	};
}

/**
 *
 * @param {Object} payload
 * @param {string} payload.checked - Checked status of topic
 * @param {number} payload.index - Index of updated topic in topic list
 * @returns {{ type: string, payload: Object }}
 */
export function changeActivationStatus(payload) {
	return { type: Types.TOPIC_CONFIG_LIST_STATUS_CHANGE, payload };
}

export function blurTitle() {
	return { type: Types.TOPIC_CONFIG_LIST_TITLE_BLUR };
}

/**
 * @param {number} index - Index of topic object of clicked title in topic list
 */
export function selectTitleForEdit(index) {
	return { type: Types.TOPIC_CONFIG_LIST_TITLE_CLICK, payload: index };
}

function getNewTopicData() {
	return {
		topicKey: Math.random()
			.toString(36)
			.substring(4, 12)
			.toLocaleUpperCase(),
		title: '',
		status: 1,
		iosCount: 0,
		androidCount: 0
	};
}

export function createTopic() {
	return {
		type: Types.TOPIC_CONFIG_LIST_CREATE_TOPIC,
		payload: getNewTopicData()
	};
}

export function cancelChanges() {
	return { type: Types.TOPIC_CONFIG_LIST_CANCEL };
}

export function saveTopic(payload, callback) {
	return () => {
		return api
			.saveTopic(payload)
			.then(res => {
				callback(res);
			})
			.catch(error);
	};
}

export function updateTopicConfigList(payload, callback) {
	return () => {
		api
			.update(payload)
			.then(res => {
				callback(res);
			})
			.catch(error);
	};
}

export function fetchTopicConfigList() {
	return dispatch => {
		dispatch({ type: Types.TOPIC_CONFIG_LIST_FETCH });
		return api
			.getTopicList()
			.then(response => {
				dispatch({
					type: Types.TOPIC_CONFIG_LIST_FETCH_SUCCESS,
					payload: response.data.data
				});
			})
			.catch(e => {
				dispatch({
					type: Types.TOPIC_CONFIG_LIST_FETCH_FAILURE,
					payload: e.message
				});
				error(e);
			});
	};
}

export function createAndUpdateTopics(topicConfigList) {
	return dispatch => {
		dispatch({ type: Types.TOPIC_CONFIG_LIST_SAVE });
		return api
			.createAndUpdate(topicConfigList)
			.then(response => {
				if (response.data.status) {
					dispatch({
						type: Types.TOPIC_CONFIG_LIST_SAVE_SUCCESS,
						payload: response.data.data
					});
				} else {
					dispatch({
						type: Types.TOPIC_CONFIG_LIST_SAVE_FAILURE,
						payload: response.data.message
					});
				}
				return response.data;
			})
			.catch(e => {
				dispatch({
					type: Types.TOPIC_CONFIG_LIST_SAVE_FAILURE,
					payload: e.message
				});
				throw e;
			});
	};
}
