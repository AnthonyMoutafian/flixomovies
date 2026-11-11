export default function getCharacters(url, options) {
  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Error Getting Movies");
    }
  });
}