import React from "react";

const Avatar = (props) => {
  const { src, size = 50, children, className } = props;

  return (
    <div
      className={`d-flex align-items-center justify-content-center rounded-circle ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: src ? "transparent" : "#007bff",
        border: "3px solid white",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        objectFit: "cover",
      }}
    >
      {/* If an image source is provided: FUTURE USE CASE TBD */}
      {src ? (
        <img
          src={src}
          className="w-100 h-100 rounded-circle"
          alt="User Avatar"
        />
      ) : (
        <span
          style={{
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {children}
        </span>
      )}
    </div>
  );
};

export default Avatar;
