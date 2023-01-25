

export const Login = (user) => {
  function loginFacebook() {
    window.open(`http://${window.location.hostname}:4999/facebook`, "_self");
  }
  return (
    <div>
      <div >Zaloguj się przez Facebook o tu:</div>
      <input type={"button"} onClick={loginFacebook} value="Zaloguj"/>
    </div>
  );
};
