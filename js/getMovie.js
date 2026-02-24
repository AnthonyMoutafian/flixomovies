export default function getMovie(filmID) {
  return fetch(`https://api.themoviedb.org/3/movie/${filmID}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmNhYTZiZWVjMWI0MzIyYmM2NDZmZWQ1ZTNiN2E3ZCIsIm5iZiI6MTc3MDQ4MDIxNC4zOTMsInN1YiI6IjY5ODc2MjU2NDYzYWNmZDBjNTJjZTM1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2qlYITW6YDjwyK2bgh_Es1krbhP04qRW35am3sAoLBE",
    },
  }).then((res) => res.json());
}
