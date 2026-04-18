'use client';

import { PhotoAlbum } from "react-photo-album";

const renderContainer = ({ containerProps, children, containerRef }) => (
  <div
    style={{
      border: "0px solid #84CC16",
      borderRadius: "10px",
      padding: "10px",
      margin: "10px",
      backdropFilter: "blur(5px)",
    }}
  >
    <div ref={containerRef} {...containerProps}>
      {children}
    </div>
  </div>
);

const renderPhoto = ({ layout, layoutOptions, imageProps }) => {
  const { alt, style, ...rest } = imageProps;

  return (
    <div
      style={{
        border: "px solid #1e1e1e",
        borderRadius: "5px",
        boxSizing: "content-box",
        alignItems: "center",
        width: style?.width,
        padding: `${layoutOptions.padding - 2}px`,
        paddingBottom: 0,
      }}
    >
      <img
        alt={alt}
        style={{ ...style, width: "100%", padding: 0, borderRadius: "10px" }}
        {...rest}
      />
      <div
        style={{
          paddingTop: "5px",
          paddingBottom: "5px",
          overflow: "visible",
          whiteSpace: "nowrap",
          textAlign: "center",
          color: "#fff",
        }}
      ></div>
    </div>
  );
};

export default function Gallery({ photos }) {
  return (
    <PhotoAlbum
      layout="masonry"
      photos={photos}
      padding={5}

      //mobile device viewport optimisation and lazy loading
      columns={(containerWidth) => {
        if (containerWidth < 500) return 1;
        if (containerWidth < 900) return 2;
        return 3;
      }}

      componentsProps={() => ({
        image: { loading: "lazy" },
      })}

    //avoid calculating layout sizes everytime a browser window is resized
      breakpoints={[300, 900, 1200]}
      spacing={5}
      renderContainer={renderContainer}
      renderPhoto={renderPhoto}
    />
  );
}
