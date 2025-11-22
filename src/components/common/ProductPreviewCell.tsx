import React from "react";

interface ProductPreviewCellProps {
  imageUrl?: string;
  name: string;
}

export const ProductPreviewCell: React.FC<ProductPreviewCellProps> = ({
  imageUrl,
  name
}) => {
  return (
    <div className="product-preview-cell">
      <div className="product-preview-thumb">
        {imageUrl ? (
          <img src={imageUrl} alt={name} />
        ) : (
          <div className="product-preview-placeholder" />
        )}
      </div>
      <span className="product-preview-name">{name}</span>
    </div>
  );
};
