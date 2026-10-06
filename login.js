// =====================================
// SUNOP Admin Login
// =====================================

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        // =====================================
        // Get Values
        // =====================================

        const username =
            document.getElementById(
                "username"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        const message =
            document.getElementById(
                "loginMessage"
            );


        // =====================================
        // Empty Username
        // =====================================

        if (username === "") {

            message.innerText =
                "✗ Please enter username";

            return;
        }


        // =====================================
        // Empty Password
        // =====================================

        if (password === "") {

            message.innerText =
                "✗ Please enter password";

            return;
        }


        // =====================================
        // Password Length
        // =====================================

        if (password.length < 6) {

            message.innerText =
                "✗ Password must contain at least 6 characters";

            return;
        }


        message.innerText =
            "Logging in...";


        // =====================================
        // Login API
        // =====================================

        fetch(
            "http://localhost:8080/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    username:
                        username,

                    password:
                        password

                })
            }
        )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Login failed: HTTP "
                    + response.status
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Login Response:",
                data
            );


            // =====================================
            // Successful Login
            // =====================================

            if (data.success === true) {

                message.innerText =
                    "✓ Login successful";


                localStorage.setItem(
                    "sunopLoggedIn",
                    "true"
                );


                localStorage.setItem(
                    "sunopUsername",
                    data.username
                );


                localStorage.setItem(
                    "sunopRole",
                    data.role
                );


                setTimeout(
                    function() {

                        window.location.href =
                            "step.html";

                    },
                    500
                );

            }

            // =====================================
            // Invalid Login
            // =====================================

            else {

                message.innerText =
                    "✗ Invalid username or password";

            }

        })

        .catch(error => {

            console.error(
                "Login Error:",
                error
            );

            message.innerText =
                "✗ Unable to connect to backend";

        });

    }
);