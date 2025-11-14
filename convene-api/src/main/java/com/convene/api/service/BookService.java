package com.convene.api.service;
import com.convene.api.model.Book; 
import com.convene.api.model.Book.Category; 
import org.springframework.stereotype.Service; 
import jakarta.annotation.PostConstruct; 
import java.util.*; 
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BookService {
    private final Map<String, Book> books = new ConcurrentHashMap<>();
    @PostConstruct
    // Données initiales
    public void init(){
        books.put("1", new Book("1", "Java Programming", "John Doe", 49.99, "1234560", Category.TECHNOLOGY)); 
        books.put("2", new Book("2", "Science Fiction", "Jane Smith", 29.99, "0987321", Category.FICTION)); 
        books.put("3", new Book("3", "World History", "Bob Johnson", 39.99, "1122455", Category.HISTORY)); 
    }
    public List<Book> getAllBooks() {
        return new ArrayList<>(books.values());
    }
    public Book getBookById(String id) {  
        return books.get(id);    
    }
     public Book createBook(String title, String author, Double price, String isbn, Category category)
    { 
        String id = UUID.randomUUID().toString(); 
        Book book = new Book(id, title, author, price, isbn, category); 
        books.put(id, book); 
        return book;    
    } 
    public Book updateBook(String id, String title, String author, Double price, String isbn, Category category) {
        Book book = books.get(id);
        if (book != null){
             if (title != null) book.setTitle(title); 
            if (author != null) book.setAuthor(author); 
            if (price != null) book.setPrice(price); 
            if (isbn != null) book.setIsbn(isbn); 
            if (category != null) book.setCategory(category);
        }
        return book;
    }
    public boolean deleteBook(String id) {
        return books.remove(id) != null; 
    }
    public List<Book> searchBooksByTitle(String title) { 
        return books.values().stream().filter(book -> book.getTitle().toLowerCase().contains(title.toLowerCase())).toList();    } 
 
    public List<Book> getBooksByCategory(Category category) { 
        return books.values().stream().filter(book -> book.getCategory() == category).toList();    
 }
}
