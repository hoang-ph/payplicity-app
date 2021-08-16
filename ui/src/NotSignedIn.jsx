import React from 'react';

function NotSignedIn() {
  return <>
      <img className="not-signed-in" src="../styles/stop.png" alt="Stop sign"/>
      <h1 className="not-signed-in">Please sign in to have access!</h1>
  </>
}

export default NotSignedIn;
