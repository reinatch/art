



// types.ts

export interface Media {
  ID: number;
  id: number;
  title: string;
  filename: string;
  filesize: number;
  url: string;
  link: string;
  alt: string;
  author: string;
  description: string;
  caption: string;
  name: string;
  status: string;
  uploaded_to: number;
  date: string;
  modified: string;
  menu_order: number;
  mime_type: string;
  type: string;
  subtype: string;
  icon: string;
  width: number;
  height: number;
  sizes: {
    thumbnail: string;
    "thumbnail-width": number;
    "thumbnail-height": number;
    medium: string;
    "medium-width": number;
    "medium-height": number;
    medium_large: string;
    "medium_large-width": number;
    "medium_large-height": number;
    large: string;
    "large-width": number;
    "large-height": number;
    "1536x1536": string;
    "1536x1536-width": number;
    "1536x1536-height": number;
    "2048x2048": string;
    "2048x2048-width": number;
    "2048x2048-height": number;
  };
}

export interface Link {
  title: string;
  url: string;
  target: string;
}

export interface AboutSection {
  title: string;
  link: Link;
}

export interface AboutSectionWithSubtitle extends AboutSection {
  subtitle: string;
  image: number;
}

export interface ProductionSection {
  title: string;
  subtitle: string;
  poster: Media;
  video: Media;
  mov: Media;
  link: Link;
}

export interface ProjectItem {
  ID: number;
  post_author: string;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: string;
  comment_status: string;
  ping_status: string;
  post_password: string;
  post_name: string;
  to_ping: string;
  pinged: string;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_type: string;
  post_mime_type: string;
  comment_count: string;
  filter: string;
}

export interface ProjectSection {
  title: string;
  subtitle: string;
  items: number[];
  items0: number[];
  thumbnails: string[];
  link: Link;
}

export interface ResidencySection {
  title: string;
  subtitle: string;
  images: Media[];
  link: Link;
}
export interface ACFData {
  home_splash: {
    poster: Media;
    video: Media;
    mov: Media;
  };
  about0: AboutSection;
  about1: AboutSectionWithSubtitle;
  production0: ProductionSection;
  production1: {
    title: string;
  };
  project0: ProjectSection;
  project1: ProjectSection;
  residency0: ResidencySection;
}
export interface HomePageData {
  // items: ProjectItem[];
  items: number[];
  items0: number[];
  link: Link;
  image: string;
  subtitle: string;
  // content: any;
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  featured_media: number;
  acf: ACFData;
}

// export type Post = {
//   id: number;
//   date: string;
//   date_gmt: string;
//   guid: {
//     rendered: string;
//   };
//   modified: string;
//   modified_gmt: string;
//   slug: string;
//   status: "publish" | "future" | "draft" | "pending" | "private";
//   type: string;
//   link: string;
//   title: {
//     rendered: string;
//   };
//   content: {
//     rendered: string;
//     protected: boolean;
//   };
//   excerpt: {
//     rendered: string;
//     protected: boolean;
//   };
//   author: number;
//   featured_media: number;
//   comment_status: "open" | "closed";
//   ping_status: "open" | "closed";
//   sticky: boolean;
//   template: string;
//   format:
//     | "standard"
//     | "aside"
//     | "chat"
//     | "gallery"
//     | "link"
//     | "image"
//     | "quote"
//     | "status"
//     | "video"
//     | "audio";
//   meta: any[];
//   categories: number[];
//   tags: number[];
// };

// export type Category = {
//   id: number;
//   count: number;
//   description: string;
//   link: string;
//   name: string;
//   slug: string;
//   taxonomy: "category";
//   parent: number;
//   meta: any[];
// };

// export type Tag = {
//   id: number;
//   count: number;
//   description: string;
//   link: string;
//   name: string;
//   slug: string;
//   taxonomy: "post_tag";
//   meta: any[];
// };
interface GalleryImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

// Define a type for the content items
interface ContentItem {
  title: string;
  content: string;
  video?: { url: string };
  image?: GalleryImage;
}

// Define a type for the ACF object
interface ACF {
  conteudo: ContentItem[];
  galeria: GalleryImage[];
  title: string;
}

// Update AboutTabData to use the ACF type
export interface AboutTabData {
  id: string; // or appropriate type
  slug: string;
  title: {
    rendered: string;
  };
  acf: ACF;
}
export type Page = {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: unknown[];
};

// export type Author = {
//   id: number;
//   name: string;
//   url: string;
//   description: string;
//   link: string;
//   slug: string;
//   avatar_urls: {
//     [key: string]: string;
//   };
//   meta: any[];
// };

// export type BlockType = {
//   api_version: number;
//   title: string;
//   name: string;
//   description: string;
//   icon: string;
//   category: string;
//   keywords: string[];
//   parent: string[];
//   supports: {
//     [key: string]: any;
//   };
//   styles: {
//     name: string;
//     label: string;
//     isDefault: boolean;
//   }[];
//   textdomain: string;
//   example: {
//     [key: string]: any;
//   };
//   attributes: {
//     [key: string]: any;
//   };
//   provides_context: {
//     [key: string]: string;
//   };
//   uses_context: string[];
//   editor_script: string;
//   script: string;
//   editor_style: string;
//   style: string;
// };

// export type EditorBlock = {
//   id: string;
//   name: string;
//   attributes: {
//     [key: string]: any;
//   };
//   innerBlocks: EditorBlock[];
//   innerHTML: string;
//   innerContent: string[];
// };

// export type TemplatePart = {
//   id: string;
//   slug: string;
//   theme: string;
//   type: string;
//   source: string;
//   origin: string;
//   content: string | EditorBlock[];
//   title: {
//     raw: string;
//     rendered: string;
//   };
//   description: string;
//   status: "publish" | "future" | "draft" | "pending" | "private";
//   wp_id: number;
//   has_theme_file: boolean;
//   author: number;
//   area: string;
// };

// export type SearchResult = {
//   id: number;
//   title: string;
//   url: string;
//   type: string;
//   subtype: string;
//   _links: {
//     self: {
//       embeddable: boolean;
//       href: string;
//     }[];
//     about: {
//       href: string;
//     }[];
//   };
// };

export type ImageMedia = {
    ID: number;
    id: number;
    title: string;
    filename: string;
    filesize: number;
    url: string;
    link: string;
    alt: string;
    author: string;
    description: string;
    caption: string;
    name: string;
    status: string;
    uploaded_to: number;
    date: string;
    modified: string;
    menu_order: number;
    mime_type: string;
    type: string;
    subtype: string;
    icon: string;
    width: number;
    height: number;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  
};

type FilterBarProps = {
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: string;
  selectedTag?: string;
  selectedCategory?: string;
};

export type Artista = {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "artistas"; // Custom taxonomy identifier
  parent: number;
  meta: unknown[];
  acf: unknown[]; // Assuming ACF (Advanced Custom Fields) is present but empty
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    "wp:post_type": { href: string }[]; // Link to related posts/projects
    curies: { name: string; href: string; templated: boolean }[];
  };
};


export type Material = {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "materiais"; // Custom taxonomy identifier
  parent: number;
  meta: unknown[];
  acf: unknown[]; // Assuming ACF (Advanced Custom Fields) is present but empty
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    "wp:post_type": { href: string }[]; // Link to related projects using this material
    curies: { name: string; href: string; templated: boolean }[];
  };
};

export type Projecto = {
  lang: string;
  translations: unknown;
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: "projectos"; // Custom post type identifier
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  template: string;
  featured_image: {
    url:string;
    width:number;
    height:number;
  
  };
  format: "standard";
  meta: unknown[];
  materiais: number[]; // Array of material taxonomy IDs
  artistas: number[]; // Array of artist taxonomy IDs
  class_list: string[]; // Array of class names associated with the post
  acf: {
    [x: string]: ReactNode;
    rightField: ReactNode;
    page_title: string;
    year: string;
    location: string;
    right_field: string;
    galeria: {
      ID: number;
      id: number;
      title: string;
      filename: string;
      filesize: number;
      url: string;
      link: string;
      alt: string;
      author: string;
      description: string;
      caption: string;
      name: string;
      status: string;
      uploaded_to: number;
      date: string;
      modified: string;
      menu_order: number;
      mime_type: string;
      type: string;
      subtype: string;
      icon: string;
      width: number;
      height: number;
      sizes: {
        [key: string]: {
          file: string;
          width: number;
          height: number;
          mime_type: string;
          source_url: string;
        };
      };
    }[];
  };
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    author: { embeddable: boolean; href: string }[];
    "acf:attachment": { embeddable: boolean; href: string }[];
    "wp:featuredmedia": { embeddable: boolean; href: string }[];
    "wp:attachment": { href: string }[];
    "wp:term": { taxonomy: string; embeddable: boolean; href: string }[];
    curies: { name: string; href: string; templated: boolean }[];
  };
};
export type homeProjecto = {
  thumbnail: string;
  lang: string;
  translations: unknown;
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: "projectos"; // Custom post type identifier
  link: string;
  title:  string;
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  template: string;
  featured_image: {
    url:string;
    width:number;
    height:number;
  
  };
  format: "standard";
  meta: unknown[];
  materiais: number[]; // Array of material taxonomy IDs
  artistas: number[]; // Array of artist taxonomy IDs
  class_list: string[]; // Array of class names associated with the post
  acf: {
    [x: string]: ReactNode;
    rightField: ReactNode;
    page_title: string;
    year: string;
    location: string;
    right_field: string;
    galeria: {
      ID: number;
      id: number;
      title: string;
      filename: string;
      filesize: number;
      url: string;
      link: string;
      alt: string;
      author: string;
      description: string;
      caption: string;
      name: string;
      status: string;
      uploaded_to: number;
      date: string;
      modified: string;
      menu_order: number;
      mime_type: string;
      type: string;
      subtype: string;
      icon: string;
      width: number;
      height: number;
      sizes: {
        [key: string]: {
          file: string;
          width: number;
          height: number;
          mime_type: string;
          source_url: string;
        };
      };
    }[];
  };
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    author: { embeddable: boolean; href: string }[];
    "acf:attachment": { embeddable: boolean; href: string }[];
    "wp:featuredmedia": { embeddable: boolean; href: string }[];
    "wp:attachment": { href: string }[];
    "wp:term": { taxonomy: string; embeddable: boolean; href: string }[];
    curies: { name: string; href: string; templated: boolean }[];
  };
};
