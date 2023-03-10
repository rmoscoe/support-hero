import { useReducer } from "react";
import {
    LOGIN,
    CREATE_USER
} from "./actions";

export default function reducer(state, action) {
    switch (action.type) {
        case LOGIN: {
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            }
        }
        case CREATE_USER: {
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            }
        }
        default:
            return state;
    }
};

export function useUserReducer(initialState) {
    return useReducer(reducer, initialState);
}