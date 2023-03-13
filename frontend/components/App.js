import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import { axiosWithAuth } from "../axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
    // ✨ MVP can be achieved with these states
    const [message, setMessage] = useState("");
    const [articles, setArticles] = useState([]);
    const [currentArticle, setCurrentArticle] = useState();
    const [spinnerOn, setSpinnerOn] = useState(false);
    const axios = axiosWithAuth();
    const token = localStorage.getItem("token");

    // ✨ Research `useNavigate` in React Router v.6
    const navigate = useNavigate();
    const redirectToLogin = () => {
        navigate("/");
    };
    const redirectToArticles = () => {
        navigate("/articles");
    };

    const logout = () => {
        // ✨ implement
        // If a token is in local storage it should be removed,
        // and a message saying "Goodbye!" should be set in its proper state.
        // In any case, we should redirect the browser back to the login screen,
        // using the helper above.
        if (token) {
            localStorage.removeItem("token");
            setMessage("Goodbye!");
            redirectToLogin();
        }
    };

    const login = ({ username, password }) => {
        // ✨ implement
        // We should flush the message state, turn on the spinner
        setMessage("");
        setSpinnerOn(true);
        // and launch a request to the proper endpoint.
        (async () => {
            try {
                const {
                    data: { message, token },
                } = await axios.post(loginUrl, { username, password });

                // On success, we should set the token to local storage in a 'token' key,
                setSpinnerOn(false);
                localStorage.setItem("token", token);
                setMessage(message);
                redirectToArticles();
            } catch (err) {
                console.log(err);
            }
        })();
        // put the server success message in its proper state, and redirect
        // to the Articles screen. Don't forget to turn off the spinner!
    };

    const getArticles = async () => {
        // ✨ implement
        // We should flush the message state, turn on the spinner
        setMessage("");
        setSpinnerOn(true);
        // and launch an authenticated request to the proper endpoint.

        try {
            const {
                data: { message, articles: articleList },
            } = await axios.get(articlesUrl);
            setMessage(message);
            setArticles(articleList);
            setSpinnerOn(false);
        } catch (err) {
            if (err.response.status === 401) {
                setSpinnerOn(false);
                redirectToLogin();
            }
        }

        // On success, we should set the articles in their proper state and
        // put the server success message in its proper state.
        // If something goes wrong, check the status of the response:
        // if it's a 401 the token might have gone bad, and we should redirect to login.
        // Don't forget to turn off the spinner!
    };

    const postArticle = (article) => {
        // ✨ implement
        // The flow is very similar to the `getArticles` function.
        // You'll know what to do! Use log statements or breakpoints
        // to inspect the response from the server.
        setSpinnerOn(true);
        (async () => {
            try {
                const {
                    data: { message, article: newArticle },
                } = await axios.post(articlesUrl, article);
                setArticles([...articles, newArticle]);
                setMessage(message);
                setSpinnerOn(false);
            } catch (err) {
                console.log(err);
            }
        })();
    };

    const updateArticle = (article) => {
        // ✨ implement
        // You got this!
        setSpinnerOn(true);
        (async () => {
            try {
                const {
                    data: { message },
                } = await axios.put(`${articlesUrl}/${article.article_id}`, article);
                await getArticles();
                setMessage(message);
            } catch (err) {
                console.log(err);
            }
        })();
    };

    const deleteArticle = (article_id) => {
        // ✨ implement
        // You got this!
        setSpinnerOn(true);
        (async () => {
            try {
                const {
                    data: { message },
                } = await axios.delete(`${articlesUrl}/${article_id}`);
                await getArticles();
                setMessage(message);
            } catch (err) {
                console.log(err);
            }
        })();
    };

    return (
        // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
        <>
            <Spinner on={spinnerOn} />
            <Message message={message} />
            <button
                id="logout"
                onClick={logout}>
                Logout from app
            </button>
            <div
                id="wrapper"
                style={{ opacity: spinnerOn ? "0.25" : "1" }}>
                {" "}
                {/* <-- do not change this line */}
                <h1>Advanced Web Applications</h1>
                <nav>
                    <NavLink
                        id="loginScreen"
                        to="/">
                        Login
                    </NavLink>
                    <NavLink
                        id="articlesScreen"
                        to="/articles">
                        Articles
                    </NavLink>
                </nav>
                <Routes>
                    <Route
                        path="/"
                        element={<LoginForm login={login} />}
                    />
                    <Route
                        path="articles"
                        element={
                            token ? (
                                <>
                                    <ArticleForm
                                        currentArticle={currentArticle}
                                        postArticle={postArticle}
                                        updateArticle={updateArticle}
                                        setCurrentArticle={setCurrentArticle}
                                    />
                                    <Articles
                                        getArticles={getArticles}
                                        articles={articles}
                                        setCurrentArticle={setCurrentArticle}
                                        deleteArticle={deleteArticle}
                                    />
                                </>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                </Routes>
                <footer>Bloom Institute of Technology 2022</footer>
            </div>
        </>
    );
}
