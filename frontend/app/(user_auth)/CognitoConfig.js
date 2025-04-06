import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
/*
import AWS from 'aws-sdk/global';
// Import Google Sign-In (Commented Out)
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In (Commented Out)
GoogleSignin.configure({
  webClientId: '908201186267-rm06isa97fv26347b4kedtg3mmmm57qq.apps.googleusercontent.com', // Replace with your actual Google Web Client ID
});
*/

// Set up your Cognito User Pool
const poolData = {
  UserPoolId: 'us-east-2_eAlMvxefc',
  ClientId: '2hhadmv0dmemntdl449397l4o1',
};

const userPool = new CognitoUserPool(poolData);

// Sign-Up User
export const signUpUser = (email, password, displayName) => {
  const attributeList = [
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'custom:display_name', Value: displayName }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) reject(err);
      else resolve({ message: 'Sign-up successful!', user: result.user });
    });
  });
};

// Sign-In User
export const signInUser = (email, password) => {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authenticationDetails = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err),
    });
  });
};

// Sign-Out User
export const signOutUser = () => {
  const user = userPool.getCurrentUser();
  if (user) user.signOut();
};

// Fetch User Attributes
export const getUserAttributes = () => { // Currently only retrieves username
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser();
  
    if (user) {
      user.getSession((err, session) => { // Make sure session is valid
        if (err || !session.isValid()) {
          console.log('Session error:', err || 'Session invalid');
          return reject('Session error or invalid');
        }
  
        user.getUserAttributes((err, attributes) => {
          if (err) {
            console.log(err)
            return reject(err)
          } else {
            const displayName = attributes.find(attr => attr.Name === 'custom:display_name');
            //console.log('Display Name:', displayName ? displayName.Value : 'No display name set');
            resolve(displayName ? displayName.Value : null);
          }
        })
      })
    }
  })
}

export const getUserCognitoSub = () => {
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser();
  
    if (user) {
      user.getSession((err, session) => { // Make sure session is valid
        if (err || !session.isValid()) {
          console.log('Session error:', err || 'Session invalid');
          return reject('Session error or invalid');
        }
  
        user.getUserAttributes((err, attributes) => {
          if (err) {
            console.log(err)
            return reject(err)
          } else {
            const sub = attributes.find(attr => attr.Name === 'sub');
            //console.log('Display Name:', displayName ? displayName.Value : 'No display name set');
            resolve(sub ? sub.Value : null);
          }
        })
      })
    }
  })
}

/*
// Handle Google Sign-Up (Commented Out)
export const handleGoogleSignUp = async () => {
  try {
    const userInfo = await GoogleSignin.signIn();
    console.log('Google user info:', userInfo);

    const googleToken = userInfo.idToken;
    if (!googleToken) throw new Error('No Google Token received');

    const logins = { 'accounts.google.com': googleToken };

    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-2:c8b301b1-f48a-47c6-832f-73eeeb9e54cc',
      Logins: logins,
    });

    AWS.config.credentials = credentials;

    credentials.refresh((err) => {
      if (err) console.error('Error refreshing credentials:', err);
      else console.log('Successfully federated with Google');
    });
  } catch (error) {
    console.error('Google sign-up error:', error);
  }
};
*/

// Confirm User
export const confirmUser = async (email, confirmationCode) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
