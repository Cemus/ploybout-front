const cardIcons: { [key: string]: string } = {};

const files = import.meta.glob("../assets/cards/icons/*.{png,jpg,jpeg,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

for (const path in files) {
  if (Object.prototype.hasOwnProperty.call(files, path)) {
    const imageName = path
      .replace("../assets/cards/icons/", "")
      .replace(/\.(png|jpg|jpeg|svg)$/, "");
    cardIcons[imageName] = files[path];
  }
}

export default cardIcons;
