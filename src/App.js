import { useState } from "react";
import axios from "axios";
import "./styles.css";

export default function App() {
  const [username, setUsename] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkbox, setCheck] = useState(false);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState();

  function handelSubmit(e) {
    e.preventDefault();
    searchRepos();
  }

  function sortByProperty(property) {
    return function (a, b) {
      if (a[property] < b[property]) return 1;
      else if (a[property] > b[property]) return -1;

      return 0;
    };
  }

  async function searchRepos() {
    setLoading(true);
    try {
      if (username !== "") {
        const res = await axios({
          method: "get",
          url: `https://api.github.com/users/${username}/repos`
        });
        setLoading(false);
        let repos = res.data;
        repos = repos.sort(sortByProperty("size"));
        setRepos(repos);
        if (error) {
          setError();
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      setError(e.response.data.message);
      setRepos([]);
    }
  }

  function renderRepo(repo) {
    const { name, fork, description, size, language } = repo;
    if (!fork) {
      return (
        <>
          <tr>
            <td>{name} </td>
            <td>{language}</td>
            <td>{description}</td>
            <td>{size}</td>
          </tr>
        </>
      );
    }
  }

  function renderFork(repo) {
    const { name, fork, description, size, language } = repo;
    console.log(fork);
    return (
      <>
        <tr>
          <td>{name} </td>
          <td>{language}</td>
          <td>{description}</td>
          <td>{size}</td>
        </tr>
      </>
    );
  }

  return (
    <div className="App">
      <h1>GitHub Repo Finder</h1>
      <div className="main-container">
        <form className="form">
          <input
            className="input"
            value={username}
            placeholder="GitHub User Name"
            onChange={(e) => setUsename(e.target.value)}
          />

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              onChange={(e) => setCheck(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Include Fork
            </label>
          </div>

          <button
            className="button search"
            onClick={(e) => handelSubmit(e)}
            disabled={username.length === 0 ? "disabled" : ""}
          >
            {loading ? "searching.." : `Search`}
          </button>
        </form>

        <div className="container">
          {error ? <h2>{error}</h2> : null}
          {repos.length !== 0 ? (
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">language</th>
                  <th scope="col">description</th>
                  <th scope="col">Size</th>
                </tr>
              </thead>
              <tbody>
                {checkbox ? repos.map(renderFork) : repos.map(renderRepo)}
              </tbody>
            </table>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
