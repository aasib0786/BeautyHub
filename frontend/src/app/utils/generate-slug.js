 function generateSlug(name, id) {
    if (!name || !id) return '';
  
    const slugPart = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')   
      .replace(/\s+/g, '-')          
      .replace(/-+/g, '-');        
  
    return `${slugPart}-${id}`;
  }

  function extractIdFromSlug(slug) {
    if (!slug) return '';
    const parts = slug.split('-');
    return parts[parts.length - 1]; 
  }

export { generateSlug, extractIdFromSlug };