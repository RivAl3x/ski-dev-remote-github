
export const $pages = {

    "register": {// Register new user page
      id: 'register',
      title: 'Register',
      message: "",
      caption: 'Agree and continue' 
    }, 
    "signIn": {// Regular sign-in page
      id: 'signin',
      title: 'Log in',
      message: "",
      caption: 'Log in' 
    },
    "confirmAccount": {// Enter confirmation code
      id: 'confirm',
      title: 'Confirm account',
      message: "Please verify your email to confirm your account.",
      caption: 'Confirm account' 
    },
    "forgotPassword": {// Ask for password reset page
      id: 'forgot',
      title: 'Reset password',
      message: "We'll be sending a link to reset the password to your email",
      caption: 'Reset password' 
    },
    /*"resetPassword": {// Reset to a new password page (2nd step after forgotPassword)
      title: 'New password',
      caption: 'Change the password' 
    },*/
    "changePassword": {// Change the password (while authenticated)
      title: 'Change password',
      message: "Please confirm by re-authenticating",
      caption: 'Change your password' 
    },
    "changeEmail": {// Change the email 
      title: 'Change email',
      message: "Please confirm by re-authenticating",
      caption: 'Change your email'
    },
    "delete": {// Delete the user account
      title: 'Delete account',
      message: "WARNING! Confirmimg with your password the account will be permanently deleted",
      caption: 'delete the account' 
    }
  };