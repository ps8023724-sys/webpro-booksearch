async function searchBooks() {
    const query = document.getElementById("searchInput").value.trim();
    const grid = document.getElementById("bookGrid");
    const message = document.getElementById("message");
    const count = document.getElementById("resultCount");
    const title = document.getElementById("sectionTitle");

    if (query === "") {
        message.textContent = "Please enter a book title or author.";
        grid.innerHTML = "";
        count.textContent = "No search yet";
        return;
    }

    grid.innerHTML = "";
    message.textContent = "Searching the library...";
    count.textContent = "Loading...";
    title.textContent = "Search results";

    try {
        const url =
            "https://openlibrary.org/search.json?q=" +
            encodeURIComponent(query) +
            "&limit=12";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to connect to the library.");
        }

        const data = await response.json();
        const books = data.docs;

        grid.innerHTML = "";

        if (books.length === 0) {
            message.textContent =
                "No books found. Try another title or author.";
            count.textContent = "0 results";
            return;
        }

        message.textContent = "";
        count.textContent = books.length + " results found";

        books.forEach(book => {
            const card = document.createElement("div");
            card.className = "book-card";

            const cover = book.cover_i
                ? "https://covers.openlibrary.org/b/id/" +
                  book.cover_i + "-M.jpg"
                : "https://placehold.co/200x280/f0e9fa/7452a3?text=No+Cover";

            const authors = book.author_name
                ? book.author_name.slice(0, 2).join(", ")
                : "Unknown author";

            const year = book.first_publish_year
                ? "First published " + book.first_publish_year
                : "Publication year unavailable";

            const bookLink = book.key
                ? "https://openlibrary.org" + book.key
                : "https://openlibrary.org";

            card.innerHTML = `
                <img class="cover"
                     src="${cover}"
                     alt="Book cover"
                     onerror="this.src='https://placehold.co/200x280/f0e9fa/7452a3?text=No+Cover'">

                <h3>${escapeHTML(book.title || "Untitled")}</h3>
                <p class="author">${escapeHTML(authors)}</p>
                <p class="year">${year}</p>

                <a href="${bookLink}" target="_blank">
                    View book ↗
                </a>
            `;

            grid.appendChild(card);
        });

    } catch (error) {
        message.textContent =
            "Something went wrong. Please check your internet connection and try again.";
        count.textContent = "Search failed";
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}
