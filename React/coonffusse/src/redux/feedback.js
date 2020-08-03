import * as ActionTypes from './ActionTypes'

export const Feedback=(state={feedbacks:[]},action)=>{
	switch(action.type){
	case ActionTypes.POST_FEEDBACK:
		var feedback = action.payload
		return {...state,feedbacks:state.feedbacks.concat(feedback)}
	case ActionTypes.GET_FEEDBACK:
		return {...state,feedbacks:action.payload}
	default:
		return state
	}
}