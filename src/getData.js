export const getSinglePost = async (slug) => {
    const res = await fetch(`https://backpack-links.vercel.app/api/posts/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
};

export const getPosts = async (page, cat, country)=>{
    const res = await fetch(`https://backpack-links.vercel.app/api/posts?page=${page}&cat=${cat || ""}&country=${country || ""}`, {
        cache: "no-store",
    });
    if(!res.ok){
        throw new Error("failed");
    }
    return res.json()
}

export const getFavorites = async (cat, country)=>{
    const res = await fetch(`https://backpack-links.vercel.app/api/favorites?cat=${cat || ""}&country=${country || ""}`, {
        cache: "no-store",
    });
    if(!res.ok){
        throw new Error("failed");
    }
    return res.json()
}

export const getPopular = async (cat, country)=>{
    const res = await fetch(`https://backpack-links.vercel.app/api/popular?cat=${cat || ""}&country=${country || ""}`, {
        cache: "no-store",
    });
    if(!res.ok){
        throw new Error("failed");
    }
    return res.json()
}

export const getCategories = async ()=>{
    const res = await fetch("https://backpack-links.vercel.app/api/categories", {
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