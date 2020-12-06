//add admin
const adminForm = document.getElementById("admin-actions");

adminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const adminEmail = document.getElementById("admin-email").value;
  const addAdmin = functions.httpsCallable("addAdmin");
  addAdmin({ email: adminEmail }).then((result) => console.log(result));
});

// listen for auth status changes
auth.onAuthStateChanged((user) => {
  console.log(user);
  if (user) {
    user.getIdTokenResult().then((idTokenResult) => {
      // console.log(idTokenResult.claims.admin);
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    db.collection("guides").onSnapshot(
      (snapshot) => {
        setupGuides(snapshot.docs);
      },
      (err) => {
        console.log(err.message);
      }
    );
  } else {
    setupUI();
    setupGuides([]);
  }
});

// create guide
const createForm = document.getElementById("create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("guides")
    .add({
      title: createForm["title"].value,
      content: createForm["content"].value,
    })
    .then(() => {
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch((err) => {
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
      console.log(err.message);
    });
});

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({ bio: signupForm["signup-bio"].value });
    })
    .then(() => {
      // close the signup modal & reset form
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector(".error").innerHTML = "";
    })
    .catch((error) => {
      signupForm.querySelector(".error").innerHTML = error.message;
    });
});

// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // log the user in
  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      // close the signup modal & reset form
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      signupForm.querySelector(".error").innerHTML = "";
    })
    .catch((error) => {
      loginForm.querySelector(".error").innerHTML = error.message;
    });
});
