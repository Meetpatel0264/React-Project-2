import React, { useEffect, useState } from 'react'
import html2canvas from "html2canvas";

const Github = () => {

    const [query, setQuery] = useState("Octocat");
    const [user, setUser] = useState({});
    const [error, setError] = useState("");

    const getUserData = () => {
        const value = document.getElementById("username").value.trim();

        if (value === "") {
            setError("Please Enter UserName");
            return;
        }

        setError("");
        setUser({});
        setQuery(value);
    };

    useEffect(() => {

        const fetchUser = async () => {
            const res = await fetch(`https://api.github.com/users/${query}`);
            const data = await res.json();

            if (data.message === "Not Found") {
                setError("User Not Found");
                setUser({});
            } else {
                setUser(data);
            }
        };

        if (query) {
            fetchUser();
        }

    }, [query]);

    const visitProfile = () => {
        if (user.html_url) {
            window.open(user.html_url, "_blank");
        } else {
            alert("Please Enter UserName");
        }
    };

    const downloadCard = () => {
        const card = document.getElementById("user-card");

        html2canvas(card).then((canvas) => {
            const link = document.createElement("a");
            link.download = "card.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <div className="container text-center" style={{ maxWidth: "500px" }}>
                <div className="card bg-dark text-white p-4 mb-4 shadow-lg rounded-4">
                    <label className="mb-2 text-start d-block">GitHub Username</label>
                    <input type="text" id="username" className="form-control bg-secondary border-0 text-white mb-3" placeholder="Enter UserName" />
                    <button className="btn btn-primary w-100" onClick={getUserData}>
                        Get User Card
                    </button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
                <div id="user-card" className="card bg-black text-white p-4 shadow-lg rounded-4">
                    <div className="mx-auto d-inline-block mb-3">
                        <img src={user.avatar_url || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"}
                            alt="avatar" className="rounded-circle border-gradient border border-primary" width="120" height="120" />
                    </div>
                    <h4 className="fw-bold">
                        {user.name || "Octocat"}
                    </h4>
                    <p className="text-secondary">@{user.login || "Octocat"}</p>

                    <p className="mt-2">{user.bio || "No bio available"}</p>

                    <div className="mt-3 small text-center">
                        <p><strong>Company:</strong> {user.company || "N/A"}</p>
                        <p><strong>Twitter:</strong> {user.twitter_username || "N/A"}</p>
                        <p><strong>Account Created:</strong> {formatDate(user.created_at)}</p>
                        <p><strong>Last Updated:</strong> {formatDate(user.updated_at)}</p>
                    </div>
                    <div className="row mt-3">
                        <div className="col-4">
                            <p className="mb-1 text-secondary">Repos</p>
                            <h5>{user.public_repos || 0}</h5>
                        </div>
                        <div className="col-4">
                            <p className="mb-1 text-secondary">Followers</p>
                            <h5>{user.followers || 0}</h5>
                        </div>
                        <div className="col-4">
                            <p className="mb-1 text-secondary">Following</p>
                            <h5>{user.following || 0}</h5>
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-3 mt-4">
                    <button className="btn btn-primary w-50" onClick={visitProfile}>
                        Visit Profile
                    </button>
                    <button onClick={downloadCard} className="btn btn-success w-50">
                        Download Card
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Github;
