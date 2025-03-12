import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails, 
  CognitoUserAttribute 
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-2_eAlMvxefc',
  ClientId: '2hhadmv0dmemntdl449397l4o1',
};

const userPool = new CognitoUserPool(poolData);

export const signUpUser = (username, password, email) => {
  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const signInUser = (username, password) => {
  const user = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

export const signOutUser = () => {
  const user = userPool.getCurrentUser();
  if (user) {
    user.signOut();
  } else {
    console.log("No user currently signed in.");
  }
};
