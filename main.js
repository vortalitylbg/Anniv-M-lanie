//INDEX
function connexion() {
    var prenom = document.getElementById("prenom").value;
    var nom = document.getElementById("nom").value;
    var errorMessage = document.getElementById("errorMessage");

    if (prenom && nom) {
        // Créez un objet utilisateur avec les informations de connexion
        var user = {
            prenom: prenom,
            nom: nom
        };

        // Convertissez l'objet utilisateur en une chaîne JSON
        var userJson = JSON.stringify(user);

        // Stockez l'objet utilisateur dans un cookie
        document.cookie = "user=" + userJson;

        // Redirigez l'utilisateur vers la page du forum
        window.location.href = "forum.html";
    } else {
        errorMessage.textContent = "Veuillez entrer un prénom et un nom.";
    }
}



//FORUM

function getUserInfo() {
    const userInfo = getCookie("user");
    return userInfo ? JSON.parse(userInfo) : {};
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

function updateUsername() {
    const user = getUserInfo();
    const userFullName = user.prenom + " " + user.nom;
    document.getElementById("user").textContent = userFullName;
}

updateUsername();

function envoyerMessage() {
const message = document.getElementById("message").value;
const imageInput = document.getElementById("imageInput");

if (message || imageInput.files.length > 0) {
const user = getUserInfo();

const messageContainer = document.createElement("div");
messageContainer.classList.add("message-container");

const userElement = document.createElement("div");
userElement.classList.add("user");
userElement.innerHTML = `<strong>${user.prenom} ${user.nom}:</strong>`;

const messageData = {
            prenom: user.prenom,
            nom: user.nom,
            message: message,
            timestamp: new Date(),
            // Enregistrez ici les médias (par exemple, l'URL de l'image).
        };
db.collection("messages").add(messageData)
            .then(function(docRef) {
                console.log("Message ajouté avec l'ID : ", docRef.id);
                document.getElementById("message").value = "";
                imageInput.value = "";
            })
            .catch(function(error) {
                console.error("Erreur lors de l'ajout du message : ", error);
            });

messageContainer.appendChild(userElement);

if (message) {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
}
if (imageInput.files.length > 0) {
    const image = document.createElement("img");
    image.src = URL.createObjectURL(imageInput.files[0]);
    image.alt = "Image";
    messageContainer.appendChild(image);
}

const messagesDiv = document.getElementById("messages");
messagesDiv.insertBefore(messageContainer, messagesDiv.firstChild);

document.getElementById("message").value = "";
imageInput.value = "";
}
}
