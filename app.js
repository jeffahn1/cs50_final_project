// Book Class: Represents a Book
class Book {
    constructor(title, author, year) {
        this.title = title;
        this.author = author;
        this.year = year;
    }
}

// UI Class: Handles UI Tasks
class UI {
    static currentPage = 1;
    static booksPerPage = 10; 
    
    static displayBooks() {
        const books = Store.getBooks();
        console.log(books);
        
        const startIndex = (UI.currentPage - 1) * UI.booksPerPage;
        const endIndex = startIndex + UI.booksPerPage;
        const booksToDisplay = books.slice(startIndex, endIndex);

        const list = document.querySelector('#book-list');
        list.innerHTML = ''; 
        // Clear list before adding for the current page
        booksToDisplay.forEach((book) => UI.addBookToList(book));

        UI.updatePaginationControls(books.length);
    }

    static updatePaginationControls(totalBooks) {
        const pageNumbers = Math.ceil(totalBooks / UI.booksPerPage);
        const paginationDiv = document.querySelector('#pagination');
        paginationDiv.innerHTML = ''; 
        
        // Clear existing pagination controls
        for (let i = 1; i <= pageNumbers; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.innerText = i;
            pageLink.classList.add('page-link');
            if (UI.currentPage === i) pageLink.classList.add('active');

            pageLink.addEventListener('click', () => {
                UI.currentPage = i;
                UI.displayBooks();
            });

            paginationDiv.appendChild(pageLink);
        }
    }

    static addBookToList(book) {
        console.log(book)
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.year}</td>
        <td><a href="#" class="btn btn-danger btn-sm
        delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
          el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 
        3000);
    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#year').value = '';
    }
    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove(); // This removes the <tr>
        }
    }


}

// Store Class: Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(year) {
    console.log(`Attempting to remove book with year: ${year}`);
    let books = Store.getBooks();
    console.log('Books before removal:', books);

    books = books.filter(book => book.year !== year);
    console.log(books);
    localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Form submission handling code here...
});

// Event: Remove a Book 
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Check if the click event is from a delete button
    if(e.target.classList.contains('delete')) {
        // Call UI.deleteBook and pass in the clicked element
        Store.removeBook(year);
        UI.deleteBook(e.target);
    }
});

// Event: Display Library
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) =>
{
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;

    // Validate
    if(title === '' || author === '' || year === '') {
        UI.showAlert('Please fill in all of the fields', 'danger');
    } else {
        // Instantiate Book
        const book = new Book(title, author, year);

        // Add Book to UI
        UI.addBookToList(book);
        
        // Add Book to Storage
        Store.addBook(book);

        // Show Success Message
        UI.showAlert('Book Added', 'Success');

        // CLear Fields
        UI.clearFields();
    }
});
// Event: Remove a Book 

document.querySelector('#book-list').addEventListener('click', (e) => 
{
    // Remove Book from UI
    if(e.target.classList.contains('delete')) {
    
        UI.deleteBook(e.target);

        // Remove book from store
        
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        
        
        // Show success message
        UI.showAlert('Book Removed', 'Success');
    }
});