import React from 'react';

function ShareButton(props) {
  const handleClick = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${props.quote}`);
  };

  return (
    <button onClick={handleClick}>
      Share on Facebook
    </button>
  );
}

export default ShareButton;
