import { PhotoAlbum, RenderContainer, RenderPhoto } from "react-photo-album";


const photos = [
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629005/Photographs/DSC08656-01_kgqggd.jpg", width: 3000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629006/Photographs/20211126_154906_ge2g9t.jpg", width: 2000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629005/Photographs/DSC00018_q3fjzn.jpg", width: 2000, height: 3000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629006/Photographs/20211124_123051_hclxud.jpg", width: 2000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629006/Photographs/DSC00336-01_dkqmq1.jpg", width: 3000, height: 1500 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629006/Photographs/IMG_0083_pm39pe.jpg", width: 2000, height: 3000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629007/Photographs/HD_20200507_222920_NR-01-01_kqtjpi.jpg", width: 3000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629007/Photographs/IMG_0257_jwbwb6.jpg", width: 3000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629007/Photographs/DSC09078-01_c2ixdk.jpg", width: 1000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629007/Photographs/IMG_0093_2_w82dy6.jpg", width: 3000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629008/Photographs/IMG_20190305_215357_yank7x.jpg", width: 1600, height: 3000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629008/Photographs/IMG_20190214_070326123_yelnrg.jpg", width: 2000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629011/Photographs/LRM_EXPORT_20190121_074405_1_vx3ous.jpg", width: 1600, height: 1600 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629013/Photographs/LRM_EXPORT_13289281781103_20190305_221122995_irpcxq.jpg", width: 1500, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629013/Photographs/LRM_EXPORT_11815796201153_20190803_230741124_ivn4fb.jpg", width: 2000, height: 3000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629014/Photographs/LRM_EXPORT_59660737647644_20190702_142540469_k04zmf.jpg", width: 1500, height: 3000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629013/Photographs/LRM_EXPORT_15674943912715_20190216_192351493_v5pska.jpg", width: 3000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629014/Photographs/IMG_20181112_103824983_jvlzmh.jpg    ", width: 3200, height: 1800 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629014/Photographs/LRM_EXPORT_38882413948542_20190824_110227782_de1ako.jpg    ", width: 3200, height: 2400 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629014/Photographs/LRM_EXPORT_50838886355026_20190708_162357172_nxx81m.jpg    ", width: 2000, height: 3000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629014/Photographs/LRM_EXPORT_107004628802955_20190301_205410235_y2id3w.jpg    ", width: 500, height: 1000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629015/Photographs/20151121_074207_ni82vv.jpg    ", width: 1900, height: 1500 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629018/Photographs/IMG_20201223_110522292_1_zuzcfb.jpg", width: 2000, height: 1000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629019/Photographs/LRM_EXPORT_83828827407435_20191027_195126039_shfpyb.jpg    ", width: 3200, height: 2400 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629020/Photographs/20151127_094052_d82hsi.jpg    ", width: 2000, height: 1000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629020/Photographs/20210621_150745_zr7qwo.jpg    ", width: 2000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629021/Photographs/LRM_EXPORT_38811986503362_20190219_214347467_doq46g.jpg    ", width: 500, height: 800 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629024/Photographs/20210114-IMG_20210114_074504_n60dco.jpg       ", width: 2000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629025/Photographs/20210621_152540_c6poyk.jpg    ", width: 2000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629027/Photographs/20201225_142328_1_jzk9ee.jpg    ", width: 3000, height: 2000 },
    { src: "https://res.cloudinary.com/duws62b88/image/upload/v1686629028/Photographs/IMG_20190723_064504093_HDR_uv7kam.jpg     ", width: 2500, height: 3200 },
    
];

const renderContainer: RenderContainer = ({ containerProps, children, containerRef }) => (
    <div
        style={{
            border: "0px solid #84CC16",
            borderRadius: "10px",
            padding: "20px",
            margin: "20px",
            backdropFilter: "blur(5px)",
        }}
    >
        <div ref={containerRef} {...containerProps}>
            {children}
        </div>
    </div>
);


const renderPhoto: RenderPhoto = ({ layout, layoutOptions, imageProps: { alt, style, ...restImageProps } }) => (
    <div
        style={{
            border: "px solid #1e1e1e",
            borderRadius: "10px",
            boxSizing: "content-box",
            alignItems: "center",
            width: style?.width,
            padding: `${layoutOptions.padding - 2}px`,
            paddingBottom: 0,
            
        }}
    >
        <img alt={alt} style={{ ...style, width: "100%", padding: 0, borderRadius: "10px" }} {...restImageProps} />
        <div
            style={{
                paddingTop: "8px",
                paddingBottom: "8px",
                overflow: "visible",
                whiteSpace: "nowrap",
                textAlign: "center",
                color: "#fff",
            }}
        >
        </div>
    </div>
);

export default function Gallery() {
    return( 
        <>
            <PhotoAlbum layout="masonry"
             photos={photos} 
             padding={10} 
             columns={(containerWidth) => {
                if (containerWidth < 500) return 1;
                if (containerWidth < 900) return 2;
                return 3;
            }}
              spacing={5}
               renderContainer={renderContainer}
                renderPhoto={renderPhoto} />
        </>
    );
     
    
}