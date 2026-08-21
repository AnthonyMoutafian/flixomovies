export default function getTVs(url, options) {
  return fetch(url, options).then((res) => res.json());
}
