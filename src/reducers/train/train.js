import * as Types from "../../constants/ActionType";

var initialState = {
  allCourse: [],
  courseID: {},
  allLesson: [],
  lessonID: {},
  type: [],
  allQuiz: [],
  quizID: {},
  loading: Types.NONE
};

export const train = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case Types.FETCH_ALL_TRAIN_COURSE:
      newState.allCourse = action.data;
      return newState;
    case Types.FETCH_ALL_TRAIN_QUIZ:
      newState.allQuiz = action.data;
      return newState;
      case Types.LOADING_CREATE_QUESTION:
        newState.loading = action.loadType;
        return newState;
    case Types.FETCH_ID_TRAIN_QUIZ:
      newState.quizID = action.data;
      return newState;

    case Types.FETCH_ID_TRAIN_COURSE:
      newState.courseID = action.data;
      return newState;


    case Types.FETCH_ALL_TRAIN_LESSON:
      newState.allLesson = action.data;
      return newState;
    case Types.FETCH_ID_TRAIN_LESSON:
      newState.lessonID = action.data;
      return newState;

    default:
      return newState;
  }
};
