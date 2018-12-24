import {

}from 'app_actions/ItemsForOrderReducer.js';

const initialState ={
    companyRoleType:[],
    extensionBasis:[],
    predefinedAbd:[],
    abdPostData:[]
};


export default function ItemsForOrderReducer(state = initialState, action) {
    switch(action.type) {
       /*case 'COMPANYTYPE': {
        return {
          ...state, companyRoleType: action.payload
        };
        break;
      }*/
      default: {
        return state;
      }
    }
}