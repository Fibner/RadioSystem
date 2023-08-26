const userReducer = (state = null, action) => {
  switch (action.type) {
    case "FETCH_USER_SUCCESS":
      // return {
      //   ...state,
      //   user: action.payload,
      // };
      // state = action.payload;
      return state = action.payload;
    case "logoutUser":
      state = null;
      return state;
    default:
      return state;
  }
};

export default userReducer;
