import React , { Component } from 'react';
import {DISHES} from '../shared/dishes.js';
import { COMMENTS } from '../shared/Comments.js';
import { PROMOTIONS } from '../shared/Promotions.js';
import { LEADERS } from '../shared/Leaders.js';

export const initialState = {
	  dishes : DISHES,
      comments: COMMENTS,
      promotions: PROMOTIONS,
      leaders: LEADERS
};

export function Reducer(state=initialState,action){
	return state;
}