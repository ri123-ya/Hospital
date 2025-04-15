import React from "react";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt odio est placeat. Corrupti fugiat commodi nam consequatur quaerat illum architecto voluptatum assumenda, est adipisci possimus repellat enim beatae quod voluptatibus atque ratione iure maiores voluptas quis dolorem. Ad esse, eveniet, enim fugiat quod similique deleniti illo, est inventore corrupti alias!
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero
