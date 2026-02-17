const nameResolver = (name: string) => {
  const isSeparated = name.includes(" ");
  // if (!isDouble) return name.slice(0, 2).toUpperCase();
  const nameArr = isSeparated ? name.split(" ") : [name];
  // const [first, last] = name.split(" ");
  nameArr[0].charAt(0).toUpperCase();
  nameArr[nameArr.length - 1].charAt(0).toUpperCase();
  if (nameArr.length > 1) {
    return nameArr[0] + " " + nameArr[nameArr.length - 1];
  } else {
    return nameArr[0];
  }
};

export default nameResolver;
