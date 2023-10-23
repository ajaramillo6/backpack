export const getSinglePost = async (slug) => {
    const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
};

export const getPosts = async (page, cat)=>{
    const res = await fetch(`http://localhost:3000/api/posts?page=${page}&cat=${cat || ""}`, {
        cache: "no-store",
    });
    if(!res.ok){
        throw new Error("failed");
    }
    return res.json()
}

export const getFavorites = async (cat)=>{
    const res = await fetch(`http://localhost:3000/api/favorites?cat=${cat || ""}`, {
        cache: "no-store",
    });
    if(!res.ok){
        throw new Error("failed");
    }
    return res.json()
}

export const getPopular = async (cat)=>{
    const res = await fetch(`http://localhost:3000/api/popular?cat=${cat || ""}`, {
        cache: "no-store",
    });
    if(!res.ok){
        throw new Error("failed");
    }
    return res.json()
}

export const getCategories = async ()=>{
    const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store",
    });
    if(!res.ok){
        throw new Error("failed");
    }
    return res.json()
}

export const fetcher = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
  
    if (!res.ok) {
      const error = new Error(data.message);
      throw error;
    }
  
    return data;
  };