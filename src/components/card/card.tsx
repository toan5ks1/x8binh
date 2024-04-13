import React from 'react';

interface CardProps {
  imageUrl: string;
  altText?: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, altText }) => {
  return (
    <div
      className="bg-white"
      style={{
        border: '1px solid #eee',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        padding: '2%',
        maxWidth: '300px',
        margin: '10px',
      }}
    >
      <img
        src={imageUrl}
        alt={altText || 'Card image'}
        style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
      />
    </div>
  );
};

export default Card;
