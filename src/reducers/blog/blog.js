import * as Types from "../../constants/ActionType";

var initialState = {
  allBlog: [],
  blogID: {  },
  type: [],
};

export const blog = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_ALL_BLOG:
      newState.allBlog = action.data;
      return newState;
    case Types.FETCH_ID_BLOG:
      newState.blogID = action.data;
      return newState;
   
    default:
      return newState;
  }
};
