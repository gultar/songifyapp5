// SearchBar.jsx

function SearchBar({ onSearchSubmit, onSearchChange, searchTerm, suggestions, setSuggestions, onSuggestionClick }) {
  
  return (
    <form className="search-bar" onSubmit={onSearchSubmit}>
        
        <input
                type="text"
                placeholder="Artist name, song, album..."
                value={searchTerm}
                onChange={onSearchChange}
                onBlur={() => {
                    setTimeout(()=>{
                        setSuggestions([])
                    }, 1000)
                }}
            />
            {suggestions.length > 0 && (
                <div className="search-dropdown">
                {suggestions.map((suggestion) => (
                    <div className="search-dropdown-item" key={suggestion.id} onClick={() => onSuggestionClick(suggestion)}>
                    {suggestion.title}
                    </div>
                ))}
                </div>
            )}
      
      <button type="submit" className="search-btn" id="search-btn">
                  <i className="fa fa-search"></i>
      </button>
    </form>
  );
}

export default SearchBar;
