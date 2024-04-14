import React from 'react';

interface CardProps {
  imageUrl: string;
  altText?: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, altText }) => {
  return (
    <div
      className="bg-white py-[4%] px-[3%] border-[#424141] border-[1px] "
      style={{
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '7%',
        maxWidth: '300px',
      }}
    >
      <img
        src={imageUrl}
        alt={altText || 'Card image'}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default Card;
