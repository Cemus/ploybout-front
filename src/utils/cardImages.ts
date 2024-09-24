const cardImages: { [key: string]: string } = {};

const files = import.meta.glob(
  "../assets/cards/images*.{png,jpg,jpeg,PNG,JPEG}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
) as Record<string, { default: string }>;

for (const path in files) {
  if (Object.prototype.hasOwnProperty.call(files, path)) {
    const imageName = path
      .replace("../assets/cards/images/", "")
      .replace(/\.(png|jpg|jpeg|PNG|JPEG)$/, "");
    cardImages[imageName] = path.replace(
      "../assets/cards/images",
      "src/assets/cards/images"
    );
  }
}

export default cardImages;
