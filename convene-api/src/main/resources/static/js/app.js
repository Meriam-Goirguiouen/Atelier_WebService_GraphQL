// URL de l'endpoint GraphQL
const GRAPHQL_URL = '/graphql';

// Fonction pour exécuter les requêtes GraphQL
async function executeGraphQL(query, variables = {}) {
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables })
        });

        const result = await response.json();

        if (result.errors) {
            console.error('Erreur GraphQL:', result.errors);
            // Afficher l'erreur dans la console de l'application ou une modal plus conviviale
            displayGraphQLError(result.errors); // Nouvelle fonction pour gérer les erreurs GraphQL
            return null;
        }

        return result.data;
    } catch (error) {
        console.error('Erreur réseau:', error);
        alert('Erreur de connexion au serveur');
        return null;
    }
}

// Nouvelle fonction pour afficher les erreurs GraphQL dans la console interactive
function displayGraphQLError(errors) {
    const graphqlResultDiv = document.getElementById('graphqlResult');
    if (graphqlResultDiv) {
        let errorMessage = '<p class="text-danger">Erreurs GraphQL:</p>';
        errors.forEach(err => {
            errorMessage += `<p class="text-danger"><strong>${err.message}</strong></p>`;
            if (err.locations) {
                errorMessage += `<p class="text-muted">Ligne: ${err.locations[0].line}, Colonne: ${err.locations[0].column}</p>`;
            }
        });
        graphqlResultDiv.innerHTML = errorMessage;
    } else {
        alert('Erreur GraphQL: ' + errors[0].message);
    }
}

// Au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    loadAllBooks(); // Charge tous les livres au démarrage

    // Gestion du formulaire d'ajout
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', event => {
            event.preventDefault(); // Empêche le rechargement de la page
            addNewBook();
        });
    }

    // Gestion du bouton Rechercher
    const searchButton = document.querySelector('#searchInput + button.btn-primary');
    if (searchButton) {
        searchButton.addEventListener('click', searchBooks);
    }

    // Gestion du filtre par catégorie
    const categoryFilterSelect = document.getElementById('categoryFilter');
    if (categoryFilterSelect) {
        categoryFilterSelect.addEventListener('change', filterByCategory);
    }

    // Gestion du bouton "Évaluer la requête" de la console GraphQL
    const evaluateGraphqlButton = document.querySelector('.graphql-card .btn-outline-primary');
    if (evaluateGraphqlButton) {
        evaluateGraphqlButton.addEventListener('click', executeGraphqlQuery);
    }

    // Initialisation des résultats GraphQL avec le message par défaut
    const graphqlResultDiv = document.getElementById('graphqlResult');
    if (graphqlResultDiv && graphqlResultDiv.innerHTML.trim() === '') {
        graphqlResultDiv.innerHTML = '<p class="text-muted">Les résultats de votre requête apparaîtront ici.</p>';
    }
});


// Charger tous les livres
async function loadAllBooks() {
    const query = `
        query {
            getAllBooks {
                id
                title
                author
                price
                isbn
                category
            }
        }
    `;

    const data = await executeGraphQL(query);
    if (data && data.getAllBooks) {
        displayBooks(data.getAllBooks);
    }
}

// Afficher les livres dans la VUE (adapté pour un tableau Bootstrap)
function displayBooks(books) {
    const booksListBody = document.getElementById('booksListBody'); // Cibler le tbody du tableau
    if (!booksListBody) {
        console.error("L'élément 'booksListBody' n'a pas été trouvé.");
        return;
    }
    booksListBody.innerHTML = ''; // Vider le contenu précédent

    if (books.length === 0) {
        // Optionnel: Afficher un message "Aucun livre" dans une ligne du tableau ou une alerte
        const noBookRow = document.createElement('tr');
        noBookRow.innerHTML = `<td colspan="6" class="text-center text-muted">Aucun livre trouvé.</td>`;
        booksListBody.appendChild(noBookRow);
        return;
    }

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.price ? `$${book.price.toFixed(2)}` : 'N/A'}</td>
            <td>${book.isbn}</td>
            <td>${book.category}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-warning me-2" onclick="editBook('${book.id}', '${book.title}', '${book.author}', ${book.price}, '${book.isbn}', '${book.category}')">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteBook('${book.id}')">Supprimer</button>
            </td>
        `;
        booksListBody.appendChild(row);
    });
}


// Ajouter un nouveau livre
async function addNewBook() {
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const priceInput = document.getElementById('price');
    const isbnInput = document.getElementById('isbn');
    const categoryInput = document.getElementById('category');

    const title = titleInput ? titleInput.value : '';
    const author = authorInput ? authorInput.value : '';
    const price = priceInput ? parseFloat(priceInput.value) : 0;
    const isbn = isbnInput ? isbnInput.value : '';
    const category = categoryInput ? categoryInput.value : '';

    // Simple validation
    if (!title || !author || isNaN(price) || !isbn || !category) {
        alert('Veuillez remplir tous les champs du formulaire.');
        return;
    }

    const mutation = `
        mutation CreateBook($title: String!, $author: String!, $price: Float!, $isbn: String!, $category: Category!) {
            createBook(title: $title, author: $title, price: $price, isbn: $isbn, category: $category) {
                id
                title
                author
            }
        }
    `;

    const variables = { title, author, price, isbn, category };
    const data = await executeGraphQL(mutation, variables);

    if (data && data.createBook) {
        alert('Livre ajouté avec succès!');
        document.getElementById('addBookForm').reset();
        loadAllBooks(); // Recharger la liste des livres
    }
}

// Rechercher des livres
async function searchBooks() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value : '';

    if (!searchTerm) {
        loadAllBooks();
        return;
    }

    const query = `
        query SearchBooks($title: String!) {
            searchBooks(title: $title) {
                id
                title
                author
                price
                isbn
                category
            }
        }
    `;

    const data = await executeGraphQL(query, { title: searchTerm });
    if (data && data.searchBooks) {
        displayBooks(data.searchBooks);
    }
}

// Filtrer par catégorie
async function filterByCategory() {
    const categoryFilterSelect = document.getElementById('categoryFilter');
    const category = categoryFilterSelect ? categoryFilterSelect.value : '';

    if (!category) {
        loadAllBooks(); // Recharger tous les livres si aucune catégorie n'est sélectionnée
        return;
    }

    const query = `
        query GetBooksByCategory($category: Category!) {
            getBooksByCategory(category: $category) {
                id
                title
                author
                price
                isbn
                category
            }
        }
    `;

    const data = await executeGraphQL(query, { category });
    if (data && data.getBooksByCategory) {
        displayBooks(data.getBooksByCategory);
    }
}

// Supprimer un livre
async function deleteBook(bookId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre?')) {
        return;
    }

    const mutation = `
        mutation DeleteBook($id: ID!) {
            deleteBook(id: $id)
        }
    `;

    const data = await executeGraphQL(mutation, { id: bookId });
    if (data && data.deleteBook) { // S'assurer que la mutation renvoie true ou un ID
        alert('Livre supprimé avec succès!');
        loadAllBooks();
    }
}

// Modifier un livre (version simplifiée)
async function editBook(bookId, currentTitle, currentAuthor, currentPrice, currentIsbn, currentCategory) {
    const newPrice = prompt(`Modifier le prix de "${currentTitle}" (actuel: $${currentPrice}):`);
    if (newPrice === null || isNaN(parseFloat(newPrice))) {
        alert('Modification annulée ou prix invalide.');
        return;
    }

    const newTitle = prompt(`Modifier le titre de "${currentTitle}" (actuel: ${currentTitle}):`, currentTitle);
    if (newTitle === null) return;

    const newAuthor = prompt(`Modifier l'auteur de "${currentAuthor}" (actuel: ${currentAuthor}):`, currentAuthor);
    if (newAuthor === null) return;

    const newIsbn = prompt(`Modifier l'ISBN de "${currentIsbn}" (actuel: ${currentIsbn}):`, currentIsbn);
    if (newIsbn === null) return;

    // Pour la catégorie, vous pourriez avoir un sélecteur plus sophistiqué
    const newCategory = prompt(`Modifier la catégorie de "${currentCategory}" (actuel: ${currentCategory}):`, currentCategory);
    if (newCategory === null) return;


    const mutation = `
        mutation UpdateBook($id: ID!, $title: String, $author: String, $price: Float, $isbn: String, $category: Category) {
            updateBook(id: $id, title: $title, author: $author, price: $price, isbn: $isbn, category: $category) {
                id
                title
                price
                author
                isbn
                category
            }
        }
    `;

    const variables = {
        id: bookId,
        title: newTitle,
        author: newAuthor,
        price: parseFloat(newPrice),
        isbn: newIsbn,
        category: newCategory // Assurez-vous que c'est une catégorie valide pour votre schéma GraphQL
    };

    const data = await executeGraphQL(mutation, variables);

    if (data && data.updateBook) {
        alert('Livre mis à jour avec succès!');
        loadAllBooks(); // Recharger la liste
    }
}

// Fonction pour exécuter la requête GraphQL depuis la console interactive
async function executeGraphqlQuery() {
    const graphqlQueryTextarea = document.getElementById('graphqlQuery');
    const graphqlResultDiv = document.getElementById('graphqlResult');

    if (!graphqlQueryTextarea || !graphqlResultDiv) return;

    const query = graphqlQueryTextarea.value;
    if (!query.trim()) {
        graphqlResultDiv.innerHTML = '<p class="text-warning">Veuillez entrer une requête GraphQL.</p>';
        return;
    }

    // Essayer de parser la requête pour extraire les variables si elles sont fournies dans un format JSON
    // C'est une simplification, pour un vrai IDE GraphQL il faudrait un parser plus robuste
    let actualQuery = query;
    let variables = {};
    try {
        const parts = query.split(/variables:\s*({.*})/s); // Tente de trouver un bloc 'variables: {...}'
        if (parts.length > 1) {
            variables = JSON.parse(parts[1]);
            actualQuery = parts[0].trim(); // La requête sans le bloc variables
        }
    } catch (e) {
        console.warn("Impossible de parser les variables GraphQL depuis la console.", e);
        // On continue avec des variables vides
    }


    graphqlResultDiv.innerHTML = '<p class="text-info">Exécution de la requête...</p>';

    const data = await executeGraphQL(actualQuery, variables);

    if (data) {
        graphqlResultDiv.innerHTML = `
            <pre class="bg-dark text-white p-3 rounded" style="max-height: 300px; overflow-y: auto;"><code>${JSON.stringify(data, null, 2)}</code></pre>
        `;
    } else {
        // executeGraphQL affichera déjà une alerte ou un message dans la console GraphQL
        graphqlResultDiv.innerHTML = '<p class="text-danger">Échec de l\'exécution de la requête.</p>';
    }
}